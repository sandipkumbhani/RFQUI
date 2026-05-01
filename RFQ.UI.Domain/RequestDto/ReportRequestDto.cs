namespace RFQ.UI.Domain.RequestDto
{
    public class ReportRequestDto
    {
        public int LinkItemId { get; set; }
        public int LocationId { get; set; }
        public DateOnly? FromDate { get; set; } = null;
        public DateOnly? ToDate { get; set; } = null;
    }
}
