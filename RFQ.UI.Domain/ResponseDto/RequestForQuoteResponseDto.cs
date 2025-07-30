namespace RFQ.UI.Domain.ResponseDto
{
    public class RequestForQuoteResponseDto
    {
        public RfqResponseDto RfqRequestDto { get; set; }
        public List<RfqRecipientResponseDto> RfqRecipients { get; set; } = new List<RfqRecipientResponseDto>();
    }
}
