namespace RFQ.UI.Domain.ResponseDto
{
    public class RfqVendorListResponseDto
    {
        public int PartyId { get; set; }
        public string? PartyName { get; set; }
        public int PartyCategoryId { get; set; }
        public string? MobNo { get; set; }
        public string? WhatsAppNo { get; set; }
        public string? PANNo { get; set; }
        public string? Email { get; set; }
    }
}
