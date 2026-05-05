using Microsoft.EntityFrameworkCore;
using PencaMundial.API.Models;

namespace PencaMundial.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        // El constructor recibe las opciones (como la cadena de conexión) y se las pasa a la clase base
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Estas propiedades DbSet son las que EF Core va a convertir en tablas en SQL Server
        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Prediction> Predictions { get; set; }

        // Usamos la Fluent API para configuraciones específicas (Clean Code)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Group>()
                .HasIndex(g => g.Code)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .IsUnique();



        }
    }
}