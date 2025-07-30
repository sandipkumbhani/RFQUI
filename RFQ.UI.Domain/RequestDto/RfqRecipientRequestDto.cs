namespace RFQ.UI.Domain.RequestDto
{
    public class RfqRecipientRequestDto
    {
        public int RfqRecipientId { get; set; }
        public int RfqId { get; set; }
        public int VendorId { get; set; }
        public string? PanNo { get; set; }
        public int VendorRating { get; set; }
        public string? MobNo { get; set; }
        public string? WhatsAppNo { get; set; }
        public string? EmailId { get; set; }
    }
}
