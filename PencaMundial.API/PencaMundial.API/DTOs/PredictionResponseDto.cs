namespace PencaMundial.API.DTOs
{
    public class PredictionResponseDto
    {
        public int Id { get; set; }
        public int MatchId { get; set; }
        public int PredictedHomeScore { get; set; }
        public int PredictedAwayScore { get; set; }
        public int PointsEarned { get; set; }
    }
}