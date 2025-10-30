namespace RFQ.UI.Domain.ResponseDto
{
    public class CompanyConfigurationResponseDto
    {
        public int CompanyConfigId { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string? SMSProvider { get; set; }
        public string SMSAuthKey { get; set; }
        public string? WhatsAppProvider { get; set; }
        public string WhatsAppAuthKey { get; set; }
        public string? SMTPHost { get; set; }
        public int SMTPPort { get; set; }
        public string? SMTPUsername { get; set; }
        public string? SMTPPassword { get; set; }
        public int StatusId { get; set; }
        public string? IsActive { get; set; }
    }
}
