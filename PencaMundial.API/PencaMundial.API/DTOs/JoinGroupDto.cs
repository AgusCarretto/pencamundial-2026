using System.ComponentModel.DataAnnotations;

namespace PencaMundial.API.DTOs
{
    public class JoinGroupDto
    {
        [Required]
        public int UserId { get; set; } 

        [Required]
        public string GroupCode { get; set; } = string.Empty; 
    }
}