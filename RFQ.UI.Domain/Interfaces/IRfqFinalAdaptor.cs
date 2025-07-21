using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRfqFinalAdaptor
    {
        Task<RfqFinalRequestDto> AddRfqFinal(RfqFinalRequestDto rfqFinalRequestDto);
    }
}
