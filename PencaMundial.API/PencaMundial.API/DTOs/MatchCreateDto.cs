using System.ComponentModel.DataAnnotations;

namespace PencaMundial.API.DTOs
{
    public class MatchCreateDto
    {
        [Required]
        public string HomeTeam { get; set; } = string.Empty;

        [Required]
        public string AwayTeam { get; set; } = string.Empty;

        [Required]
        public DateTime MatchDate { get; set; }
    }
}