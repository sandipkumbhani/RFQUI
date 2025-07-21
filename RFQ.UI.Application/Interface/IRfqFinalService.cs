using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Interface
{
    public interface IRfqFinalService
    {
        Task<RfqFinalRequestDto> AddRfqFinal(RfqFinalRequestDto rfqFinalRequestDto);
    }
}
