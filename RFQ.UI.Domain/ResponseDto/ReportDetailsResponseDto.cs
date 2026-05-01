namespace RFQ.UI.Domain.ResponseDto
{
    public class ReportDetailsResponseDto
    {
        public string? ReportName { get; set; }
        public List<string>? Columns { get; set; }
        public List<Dictionary<string, object>>? Rows { get; set; }
    }
}
