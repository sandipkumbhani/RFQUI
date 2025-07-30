namespace RFQ.UI.Domain.ResponseDto
{
    public class RfqResponseDto
    {
        public RfqDto Rfq { get; set; }
        public List<RfqRecipientDto> RfqRecipients { get; set; } = new List<RfqRecipientDto>();
    }
}
