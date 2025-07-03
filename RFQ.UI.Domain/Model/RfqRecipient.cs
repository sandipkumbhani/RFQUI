namespace RFQ.UI.Domain.Model
{
    public class RfqRecipient
    {
        public int? RfqDetailId { get; set; }
        public int? LocationId { get; set; }
        public int? LocUserId { get; set; }
        public int VendorId { get; set; }
        public int VendorRating { get; set; }
        public string? MobNo { get; set; }
        public string? WhatsAppNo { get; set; }
        public string? EmailId { get; set; }
    }
}
