using PencaMundial.API.Models;
using System.Threading.Tasks;

namespace PencaMundial.API.Data
{
    public static class DbSeeder
    {
        public static async Task SeedMatches(ApplicationDbContext context)
        {
            // Ya no usamos la precarga manual, ahora todo viene de la API.
            // Dejamos el método vacío para que no rompa el llamado en Program.cs
            await Task.CompletedTask;
        }
    }
}