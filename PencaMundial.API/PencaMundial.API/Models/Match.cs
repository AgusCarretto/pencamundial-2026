namespace PencaMundial.API.Models
{
    public class Match
    {
        public int Id { get; set; }

        public string HomeTeam { get; set; } = string.Empty;

        public string AwayTeam { get; set; } = string.Empty;

        // Goles reales del partido (pueden ser nulos si el partido no empezó)
        public int? HomeScore { get; set; }
        public int? AwayScore { get; set; }

        public DateTime MatchDate { get; set; }

        public string Status { get; set; } = "Pending"; // Estados posibles: Pending, InProgress, Finished

        // Propiedad de navegación: Todas las predicciones que hicieron los usuarios sobre este partido
        public ICollection<Prediction> Predictions { get; set; } = new List<Prediction>();
    }
}