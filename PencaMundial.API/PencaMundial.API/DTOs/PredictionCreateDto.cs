using System.ComponentModel.DataAnnotations;

namespace PencaMundial.API.DTOs
{
    public class PredictionCreateDto
    {
        [Required]
        public int MatchId { get; set; }

        [Required]
        [Range(0, 999, ErrorMessage = "Los goles no pueden ser negativos ni mas de 999.")]
        public int PredictedHomeScore { get; set; }

        [Required]
        [Range(0, 999, ErrorMessage = "Los goles no pueden ser negativos ni mas de 999.")]
        public int PredictedAwayScore { get; set; }
    }
}