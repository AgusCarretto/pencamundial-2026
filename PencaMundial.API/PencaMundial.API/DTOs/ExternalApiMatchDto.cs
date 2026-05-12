namespace PencaMundial.API.DTOs
{
    // Esta es una estructura genérica. Luego la ajustaremos a la API real que elijamos 
    // (como API-Football o Football-Data).
    public class ExternalApiMatchDto
    {
        public string HomeTeam { get; set; } = string.Empty;
        public string AwayTeam { get; set; } = string.Empty;
        public DateTime MatchDate { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public int? HomeScore { get; set; }
        public int? AwayScore { get; set; }
        public string Status { get; set; } = string.Empty; // Ej: "Not Started", "Finished"
    }
}