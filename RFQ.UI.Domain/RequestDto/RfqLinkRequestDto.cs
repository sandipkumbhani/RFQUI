namespace RFQ.UI.Domain.RequestDto
{
    public class RfqLinkRequestDto
    {
        public int RfqRateLinkId { get; set; }
        public int RfqId { get; set; }
        public int VendorId { get; set; }
        public string SharedLink { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
