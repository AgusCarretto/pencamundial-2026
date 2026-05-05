using System.ComponentModel.DataAnnotations;

namespace PencaMundial.API.DTOs
{
    public class GroupCreateDto
    {
        [Required(ErrorMessage = "El nombre del grupo es obligatorio.")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "El nombre del grupo debe tener entre 3 y 20 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }
}