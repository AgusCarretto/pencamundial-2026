namespace PencaMundial.API.Models
{
    public class Group
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Code { get; set; } = string.Empty; // Ej: "PENCA-AMIGOS-123"

        // Propiedad de navegación: Los usuarios que pertenecen a este grupo
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}