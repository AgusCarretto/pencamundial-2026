using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PencaMundial.API.Data;
using PencaMundial.API.DTOs;
using PencaMundial.API.Models;

namespace PencaMundial.API.Controllers
{
    [Authorize] // Protegemos también los partidos, solo usuarios logueados los ven
    [Route("api/[controller]")]
    [ApiController]
    public class MatchesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MatchesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Matches
        // Trae todos los partidos ordenados por fecha (los más próximos primero)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MatchResponseDto>>> GetMatches()
        {
            var matches = await _context.Matches
                .OrderBy(m => m.MatchDate)
                .Select(m => new MatchResponseDto
                {
                    Id = m.Id,
                    HomeTeam = m.HomeTeam,
                    AwayTeam = m.AwayTeam,
                    HomeScore = m.HomeScore,
                    AwayScore = m.AwayScore,
                    MatchDate = m.MatchDate,
                    Status = m.Status
                })
                .ToListAsync();

            return Ok(matches);
        }

        // POST: api/Matches
        // Para cargar la grilla inicial (Uruguay vs Corea, etc.)
        [HttpPost]
        public async Task<ActionResult<MatchResponseDto>> CreateMatch(MatchCreateDto dto)
        {
            var match = new Match
            {
                HomeTeam = dto.HomeTeam,
                AwayTeam = dto.AwayTeam,
                MatchDate = dto.MatchDate,
                Status = "Pending" // Todo partido nuevo arranca en "Pendiente"
            };

            _context.Matches.Add(match);
            await _context.SaveChangesAsync();

            var response = new MatchResponseDto
            {
                Id = match.Id,
                HomeTeam = match.HomeTeam,
                AwayTeam = match.AwayTeam,
                MatchDate = match.MatchDate,
                Status = match.Status
            };

            return CreatedAtAction(nameof(GetMatches), new { id = match.Id }, response);
        }



        [HttpPost("{id}/finish")]
        public async Task<IActionResult> FinishMatch(int id, MatchResultDto dto)
        {
            // 1. Buscamos el partido
            var match = await _context.Matches.FindAsync(id);
            if (match == null) return NotFound("Partido no encontrado.");

            if (match.Status == "Finished")
            {
                return BadRequest("Este partido ya fue finalizado y los puntos ya se repartieron.");
            }

            // 2. Actualizamos el partido con el resultado real
            match.HomeScore = dto.HomeScore;
            match.AwayScore = dto.AwayScore;
            match.Status = "Finished";

            // 3. Traemos todas las predicciones de ESTE partido y sus usuarios
            var predictions = await _context.Predictions
                .Where(p => p.MatchId == id)
                .ToListAsync();

            // 4. EL MOTOR DE PUNTOS
            foreach (var pred in predictions)
            {
                int points = CalculatePoints(
                    dto.HomeScore, dto.AwayScore,
                    pred.PredictedHomeScore, pred.PredictedAwayScore
                );

                // Guardamos los puntos en la predicción
                pred.PointsEarned = points;

                // Le sumamos los puntos al Total del Usuario
                var user = await _context.Users.FindAsync(pred.UserId);
                if (user != null)
                {
                    user.TotalPoints += points;
                }
            }

            // Guardamos absolutamente todo de una sola vez
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Partido finalizado. Se procesaron {predictions.Count} predicciones." });
        }

        // Método privado auxiliar para limpiar el código (Clean Code)
        private int CalculatePoints(int realHome, int realAway, int predHome, int predAway)
        {
            // 1. Resultado Exacto (8 puntos)
            if (realHome == predHome && realAway == predAway)
            {
                return 8;
            }

            // 2. Acierto de Ganador o Empate (5 puntos)
            // Usamos Math.Sign que devuelve 1 (si es positivo), -1 (si es negativo) o 0 (si es empate)
            int realResult = Math.Sign(realHome - realAway);
            int predResult = Math.Sign(predHome - predAway);

            if (realResult == predResult)
            {
                return 5;
            }

            // 3. Erró (0 puntos)
            return 0;
        }


    }
}