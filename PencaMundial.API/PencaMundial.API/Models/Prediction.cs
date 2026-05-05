namespace PencaMundial.API.Models
{
    public class Prediction
    {
        public int Id { get; set; }

        // Relación con el Usuario (Foreign Key explícita)
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Relación con el Partido (Foreign Key explícita)
        public int MatchId { get; set; }
        public Match Match { get; set; } = null!;

        // Lo que el usuario predijo
        public int PredictedHomeScore { get; set; }
        public int PredictedAwayScore { get; set; }

        // Puntos obtenidos (0, 3, 5 u 8). Se actualiza cuando el Status del Match pasa a "Finished"
        public int PointsEarned { get; set; } = 0;
    }
}