namespace RFQ.UI.Domain.RequestDto
{
    public class AutoGenerateCodeRequestDto
    {
        public int? UserId { get; set; }
        public string? Code { get; set; }
        public string? Prefix { get; set; }
    }
}
