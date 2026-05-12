namespace PencaMundial.API.DTOs
{
    public class MatchResponseDto
    {
        public int Id { get; set; }
        public string HomeTeam { get; set; } = string.Empty;
        public string AwayTeam { get; set; } = string.Empty;
        public int? HomeScore { get; set; } // Puede ser null si no se jugó
        public int? AwayScore { get; set; } // Puede ser null si no se jugó

        public string GroupName { get; set; } = string.Empty; // Grupo A, B, C, etc.

        public DateTime MatchDate { get; set; }
        public string Status { get; set; } = string.Empty; // Pending, InProgress, Finished
    }
}