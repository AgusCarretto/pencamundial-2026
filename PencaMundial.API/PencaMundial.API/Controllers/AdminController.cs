using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PencaMundial.API.Data;
using PencaMundial.API.DTOs;
using PencaMundial.API.Services;

namespace PencaMundial.API.Controllers
{
    [Authorize] // En producción aquí chequearías [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly SyncService _syncService;

        public AdminController(ApplicationDbContext context, SyncService syncService)
        {
            _context = context;
            _syncService = syncService;
        }



        [HttpPost("sync")]
        public async Task<IActionResult> SyncMatches()
        {
            try
            {
                // Llamamos al servicio que armamos recién
                string resultMessage = await _syncService.SyncMatchesAsync();

                return Ok(new { message = resultMessage });
            }
            catch (Exception ex)
            {
                // En caso de que la API externa falle o haya un problema de red
                return StatusCode(500, new { message = "Error sincronizando datos: " + ex.Message });
            }
        }



        [HttpDelete("reset-database")]
        public async Task<IActionResult> ResetDatabase()
        {
            // 1. Primero borramos todas las predicciones para que no haya conflictos de clave foránea
            var predictions = await _context.Predictions.ToListAsync();
            _context.Predictions.RemoveRange(predictions);

            // 2. Ahora sí, borramos todos los partidos
            var matches = await _context.Matches.ToListAsync();
            _context.Matches.RemoveRange(matches);

            await _context.SaveChangesAsync();

            // 3. (Opcional pero recomendado) Reiniciamos el contador de IDs a 0 para que el próximo partido vuelva a ser el Id 1
            // Nota: Esto funciona en SQL Server. 
            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Matches', RESEED, 0)");
            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Predictions', RESEED, 0)");

            return Ok(new { message = "Base de datos reseteada. Todas las predicciones y partidos fueron eliminados." });
        }




        [HttpPost("finish-match")]
        public async Task<IActionResult> FinishMatch([FromBody] FinishMatchDto dto)
        {
            // 1. Buscamos el partido
            var match = await _context.Matches.FindAsync(dto.MatchId);
            if (match == null) return NotFound("Partido no encontrado.");
            if (match.Status == "Finished") return BadRequest("El partido ya fue finalizado.");

            // 2. Actualizamos el resultado real
            match.HomeScore = dto.ActualHomeScore;
            match.AwayScore = dto.ActualAwayScore;
            match.Status = "Finished";

            // 3. Lógica de Puntos: Buscamos todas las predicciones de este partido
            var predictions = await _context.Predictions
                .Where(p => p.MatchId == dto.MatchId)
                .Include(p => p.User)
                .ToListAsync();

            foreach (var pred in predictions)
            {
                int pointsEarned = 0;

                // Caso A: Acierto exacto (Ej: 2-1 y salió 2-1) -> 3 puntos
                if (pred.PredictedHomeScore == dto.ActualHomeScore &&
                    pred.PredictedAwayScore == dto.ActualAwayScore)
                {
                    pointsEarned = 8;
                }
                // Caso B: Acierto de resultado/tendencia (Ej: dijo que ganaba Local y ganó Local) -> 3 puntos
                else if (GetResult(pred.PredictedHomeScore, pred.PredictedAwayScore) ==
                         GetResult(dto.ActualHomeScore, dto.ActualAwayScore))
                {
                    pointsEarned = 3;
                }

                // Sumamos los puntos al perfil del usuario
                pred.User.TotalPoints += pointsEarned;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Partido finalizado y puntos repartidos con éxito." });
        }

        // Función auxiliar para determinar Ganador/Empate
        private int GetResult(int home, int away)
        {
            if (home > away) return 1; // Gana Local
            if (home < away) return 2; // Gana Visitante
            return 0; // Empate
        }
    }

    // DTO para la petición
    public class FinishMatchDto
    {
        public int MatchId { get; set; }
        public int ActualHomeScore { get; set; }
        public int ActualAwayScore { get; set; }
    }
}