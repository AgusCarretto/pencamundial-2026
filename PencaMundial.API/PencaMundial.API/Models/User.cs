namespace PencaMundial.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty; 
        public string PhoneNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int TotalPoints { get; set; } = 0;

        public ICollection<Group> Groups { get; set; } = new List<Group>();
        public ICollection<Prediction> Predictions { get; set; } = new List<Prediction>();
    }
}