namespace RFQ.UI.Domain.RequestDto
{
    public class RfqFinalizationSaveRequestDto
    {
        public RfqFinalRequestDto? RfqFinalDto { get; set; }
        public List<RfqFinalRateRequestDto>? RfqFinalRateDtos { get; set; }
    }
}
