using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PencaMundial.API.Data;
using PencaMundial.API.DTOs;
using PencaMundial.API.Models;

namespace PencaMundial.API.Controllers
{
    [Authorize] // Candado puesto
    [Route("api/[controller]")]
    [ApiController]
    public class PredictionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PredictionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<PredictionResponseDto>> SubmitPrediction(PredictionCreateDto dto)
        {
            // 1. MAGIA DE SEGURIDAD: Sacamos el ID del usuario directamente del Token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("Token inválido.");

            int userId = int.Parse(userIdClaim);

            // 2. Verificamos que el partido exista y no haya empezado
            var match = await _context.Matches.FindAsync(dto.MatchId);
            if (match == null) return NotFound("El partido no existe.");

            if (match.Status != "Pending")
            {
                return BadRequest("No puedes predecir ni cambiar un resultado de un partido que ya empezó o terminó.");
            }

            // 3. Buscamos si el usuario ya tenía una predicción guardada para este partido
            var existingPrediction = await _context.Predictions
                .SingleOrDefaultAsync(p => p.UserId == userId && p.MatchId == dto.MatchId);

            Prediction prediction;

            if (existingPrediction != null)
            {
                // Si ya existe, simplemente actualizamos los goles
                existingPrediction.PredictedHomeScore = dto.PredictedHomeScore;
                existingPrediction.PredictedAwayScore = dto.PredictedAwayScore;
                prediction = existingPrediction;
            }
            else
            {
                // Si no existe, creamos el registro nuevo
                prediction = new Prediction
                {
                    UserId = userId,
                    MatchId = dto.MatchId,
                    PredictedHomeScore = dto.PredictedHomeScore,
                    PredictedAwayScore = dto.PredictedAwayScore,
                    PointsEarned = 0
                };
                _context.Predictions.Add(prediction);
            }

            // Guardamos en SQL Server
            await _context.SaveChangesAsync();

            // Devolvemos el DTO
            return Ok(new PredictionResponseDto
            {
                Id = prediction.Id,
                MatchId = prediction.MatchId,
                PredictedHomeScore = prediction.PredictedHomeScore,
                PredictedAwayScore = prediction.PredictedAwayScore,
                PointsEarned = prediction.PointsEarned
            });
        }
    }
}