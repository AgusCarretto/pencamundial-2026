using System.Text.Json.Serialization;

namespace PencaMundial.API.DTOs
{
    // Clases para mapear exactamente el JSON que devuelve API-Football
    public class ApiFootballResponse
    {
        [JsonPropertyName("response")]
        public List<ApiFootballFixtureItem> Response { get; set; } = new();
    }

    public class ApiFootballFixtureItem
    {
        [JsonPropertyName("fixture")]
        public FixtureData Fixture { get; set; } = new();

        [JsonPropertyName("league")]
        public LeagueData League { get; set; } = new();

        [JsonPropertyName("teams")]
        public TeamsData Teams { get; set; } = new();

        [JsonPropertyName("goals")]
        public GoalsData Goals { get; set; } = new();
    }

    public class FixtureData
    {
        [JsonPropertyName("date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("status")]
        public StatusData Status { get; set; } = new();
    }

    public class StatusData
    {
        [JsonPropertyName("short")]
        public string Short { get; set; } = string.Empty; // "NS" (Not Started), "FT" (Full Time)
    }

    public class LeagueData
    {
        [JsonPropertyName("round")]
        public string Round { get; set; } = string.Empty; // Ej: "Group A - 1"
    }

    public class TeamsData
    {
        [JsonPropertyName("home")]
        public TeamData Home { get; set; } = new();

        [JsonPropertyName("away")]
        public TeamData Away { get; set; } = new();
    }

    public class TeamData
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }

    public class GoalsData
    {
        [JsonPropertyName("home")]
        public int? Home { get; set; }

        [JsonPropertyName("away")]
        public int? Away { get; set; }
    }
}