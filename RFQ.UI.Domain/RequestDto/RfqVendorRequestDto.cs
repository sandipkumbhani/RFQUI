using RFQ.UI.Domain.Model;

namespace RFQ.UI.Domain.RequestDto
{
    public class RfqVendorRequestDto
    {
        public RfqVendorRequestDto()
        {
            Rfq = new();
            RfqDetails = new();
            rfqRecipients = new();
        }
        public RfqDto Rfq { get; set; }
        public RfqDetailDto RfqDetails { get; set; }
        public List<RfqRecipient> rfqRecipients { get; set; }
    }
}
