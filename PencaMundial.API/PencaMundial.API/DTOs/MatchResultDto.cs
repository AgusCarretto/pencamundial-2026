using System.ComponentModel.DataAnnotations;

namespace PencaMundial.API.DTOs
{
    public class MatchResultDto
    {
        [Required]
        [Range(0, 20)]
        public int HomeScore { get; set; }

        [Required]
        [Range(0, 20)]
        public int AwayScore { get; set; }
    }
}