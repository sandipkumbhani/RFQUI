namespace RFQ.UI.Domain.ResponseDto
{
    public class DashboardCardDetailsResponseDto
    {
        public List<string>? Columns { get; set; }
        public List<Dictionary<string, object>>? Rows { get; set; }
    }
}
