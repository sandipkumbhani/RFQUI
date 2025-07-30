namespace RFQ.UI.Domain.RequestDto
{
    public class RequestForQouteRequestDto
    {
        public RfqRequestDto RfqRequestDto { get; set; }
        public List<RfqRecipientRequestDto> RfqRecipients { get; set; } = new List<RfqRecipientRequestDto>();
    }
}
