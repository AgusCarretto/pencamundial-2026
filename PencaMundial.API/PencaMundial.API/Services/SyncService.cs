using Microsoft.EntityFrameworkCore;
using PencaMundial.API.Data;
using PencaMundial.API.DTOs;
using PencaMundial.API.Models;
using System.Text.Json;

namespace PencaMundial.API.Services
{
    public class SyncService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        // Inyectamos IConfiguration para leer el appsettings.json
        public SyncService(ApplicationDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<string> SyncMatchesAsync()
        {
            // AHORA LLAMAMOS AL MÉTODO REAL
            var externalMatches = await FetchMatchesFromFootballDataAsync();

            if (externalMatches == null || !externalMatches.Any())
                return "No se encontraron datos en la API. Revisa tu API Key o los parámetros.";

            int created = 0;
            int updated = 0;

            foreach (var extMatch in externalMatches)
            {
                var dbMatch = await _context.Matches.FirstOrDefaultAsync(m =>
                    m.HomeTeam == extMatch.HomeTeam && m.AwayTeam == extMatch.AwayTeam);

                if (dbMatch == null)
                {
                    var newMatch = new Match
                    {
                        HomeTeam = extMatch.HomeTeam,
                        AwayTeam = extMatch.AwayTeam,
                        MatchDate = extMatch.MatchDate,
                        GroupName = extMatch.GroupName,
                        HomeScore = extMatch.HomeScore,
                        AwayScore = extMatch.AwayScore,
                        Status = extMatch.Status == "Finished" ? "Finished" : "Pending"
                    };
                    _context.Matches.Add(newMatch);
                    created++;
                }
                else
                {
                    if (dbMatch.Status == "Finished") continue;

                    dbMatch.MatchDate = extMatch.MatchDate;
                    dbMatch.HomeScore = extMatch.HomeScore;
                    dbMatch.AwayScore = extMatch.AwayScore;

                    // Detectamos si el partido acaba de finalizar en la API
                    if (extMatch.Status == "Finished")
                    {
                        dbMatch.Status = "Finished";

                        // ¡REPARTIMOS LOS PUNTOS! 
                        // Usamos los goles que vienen de la API
                        await DistributePointsAsync(dbMatch.Id, extMatch.HomeScore ?? 0, extMatch.AwayScore ?? 0);
                    }
                    updated++;
                }
            }

            await _context.SaveChangesAsync();
            return $"Sincronización completa desde API. Creados: {created}, Actualizados: {updated}.";
        }



        public async Task DistributePointsAsync(int matchId, int actualHome, int actualAway)
        {
            // Buscamos todas las predicciones para este partido e incluimos al Usuario
            var predictions = await _context.Predictions
                .Include(p => p.User)
                .Where(p => p.MatchId == matchId)
                .ToListAsync();

            foreach (var pred in predictions)
            {
                int pointsEarned = 0;

                // Caso A: Resultado exacto (8 puntos)
                if (pred.PredictedHomeScore == actualHome && pred.PredictedAwayScore == actualAway)
                {
                    pointsEarned = 8;
                }
                // Caso B: Acierto de tendencia (3 puntos)
                else if (DetermineWinner(pred.PredictedHomeScore, pred.PredictedAwayScore) ==
                         DetermineWinner(actualHome, actualAway))
                {
                    pointsEarned = 3;
                }

                if (pointsEarned > 0)
                {
                    pred.User.TotalPoints += pointsEarned;
                }
            }
            // No hace falta SaveChangesAsync acá porque el método principal lo hace al final
        }

        // Función auxiliar para determinar Local (1), Visitante (2) o Empate (0)
        private int DetermineWinner(int home, int away)
        {
            if (home > away) return 1;
            if (home < away) return 2;
            return 0;
        }



        private async Task<List<ExternalApiMatchDto>> FetchMatchesFromFootballDataAsync()
        {
            var apiKey = _configuration["FootballData:ApiKey"];
            var client = _httpClientFactory.CreateClient();

            // El header de esta API es distinto
            client.DefaultRequestHeaders.Add("X-Auth-Token", apiKey);

            var response = await client.GetAsync("https://api.football-data.org/v4/competitions/WC/matches");

            if (!response.IsSuccessStatusCode) return new List<ExternalApiMatchDto>();

            var content = await response.Content.ReadAsStringAsync();
            // Aquí usamos un JObject o una clase para deserializar la respuesta de Football-Data
            // Ellos devuelven un objeto "matches" que es un array
            var json = JsonDocument.Parse(content);
            var mappedList = new List<ExternalApiMatchDto>();

            foreach (var item in json.RootElement.GetProperty("matches").EnumerateArray())
            {
                // 1. Extraemos los nombres de los equipos con seguridad (si son null, ponemos "A definir")
                string homeName = "A definir";
                if (item.TryGetProperty("homeTeam", out var homeTeam) && homeTeam.ValueKind != JsonValueKind.Null)
                {
                    homeName = homeTeam.GetProperty("name").GetString() ?? "A definir";
                }

                string awayName = "A definir";
                if (item.TryGetProperty("awayTeam", out var awayTeam) && awayTeam.ValueKind != JsonValueKind.Null)
                {
                    awayName = awayTeam.GetProperty("name").GetString() ?? "A definir";
                }

                // 2. Extraemos el grupo o la fase con seguridad
                string group = "Fase Final";
                if (item.TryGetProperty("group", out var groupProp) && groupProp.ValueKind != JsonValueKind.Null)
                {
                    group = groupProp.GetString() ?? "Fase Final";
                }

                // 3. Extraemos los goles (con chequeo profundo de nulos)
                int? hScore = null;
                int? aScore = null;

                if (item.TryGetProperty("score", out var scoreProp) &&
                    scoreProp.TryGetProperty("fullTime", out var ftProp))
                {
                    if (ftProp.GetProperty("home").ValueKind != JsonValueKind.Null)
                        hScore = ftProp.GetProperty("home").GetInt32();

                    if (ftProp.GetProperty("away").ValueKind != JsonValueKind.Null)
                        aScore = ftProp.GetProperty("away").GetInt32();
                }

                // 4. Mapeamos al DTO
                mappedList.Add(new ExternalApiMatchDto
                {
                    HomeTeam = TranslateTeamName(homeName),
                    AwayTeam = TranslateTeamName(awayName),
                    MatchDate = item.GetProperty("utcDate").GetDateTime(),
                    GroupName = TranslateRoundToGroup(group),
                    HomeScore = hScore,
                    AwayScore = aScore,
                    Status = item.GetProperty("status").GetString() == "FINISHED" ? "Finished" : "Pending"
                });
            }

            return mappedList;
        }

        // --- TRADUCTORES ---
        private string TranslateTeamName(string englishName)
        {
            var map = new Dictionary<string, string>
            {
                {"United States", "Estados Unidos"}, {"Mexico", "México"}, {"Canada", "Canadá"},
                {"Spain", "España"}, {"Germany", "Alemania"}, {"England", "Inglaterra"},
                {"France", "Francia"}, {"Brazil", "Brasil"}, {"Japan", "Japón"},
                {"Netherlands", "Países Bajos"}, {"Morocco", "Marruecos"}, {"Switzerland", "Suiza"},
                {"Belgium", "Bélgica"}, {"Croatia", "Croacia"}, {"Denmark", "Dinamarca"},
                {"South Korea", "Corea del Sur"}, {"Cameroon", "Camerún"}, {"Tunisia", "Túnez"},
                {"Saudi Arabia", "Arabia Saudita"}, {"Wales", "Gales"}, {"Poland", "Polonia"}
            };
            return map.ContainsKey(englishName) ? map[englishName] : englishName;
        }

        private string TranslateRoundToGroup(string roundName)
        {
            if (string.IsNullOrEmpty(roundName)) return "Sin Grupo";

            // Si la API manda algo como "Group A - 1" o "Group A", armamos "Grupo A"
            if (roundName.Contains("Group", StringComparison.OrdinalIgnoreCase))
            {
                var split = roundName.Split(' ');
                if (split.Length >= 2)
                {
                    // Tomamos la palabra "Group" y la letra que le sigue
                    return $"Grupo {split[1]}";
                }
            }

            // Traductor para las fases finales
            var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        {"Round of 32", "16avos de Final"},
        {"Round of 16", "Octavos de Final"},
        {"Quarter-finals", "Cuartos de Final"},
        {"Semi-finals", "Semifinales"},
        {"3rd Place Final", "Tercer Puesto"},
        {"Final", "Final"}
    };

            foreach (var key in map.Keys)
            {
                if (roundName.Contains(key, StringComparison.OrdinalIgnoreCase))
                    return map[key];
            }

            // Si manda algo raro que no conocemos, mostramos el texto original para saber qué es
            return roundName;
        }
    }
}