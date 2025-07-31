using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IRfqFinalService
    {
        Task<RfqFinalRequestDto> AddRfqFinal(RfqFinalRequestDto rfqFinalRequestDto);
        Task<IEnumerable<VendorFinalizationResposeDto>> AwardedVendor(int id);
    }
}
