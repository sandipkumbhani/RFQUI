using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Interface
{
    public interface IRfqLinkService
    {
        Task<bool> AddRfqLinkData(List<RfqLinkRequestDto> rfqLinkRequestDto);
    }
}
