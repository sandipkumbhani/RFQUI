namespace RFQ.UI.Domain.RequestDto
{
    public class CompanyConfigrationRequestDto
    {
        public int CompanyConfigrationId { get; set; }
        public int CompanyId { get; set; }

        public string? SMSProvider { get; set; }

        public int SMSAuthKey { get; set; }

        public string? WhatsAppProvider { get; set; }

        public int WhatsAppAuthKey { get; set; }

        public string? SMTPHost { get; set; }

        public int SMTPPort { get; set; }

        public string? SMTPUsername { get; set; }

        public string? SMTPPassword { get; set; }
    }
}
