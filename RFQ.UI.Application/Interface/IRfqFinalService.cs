using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IRfqFinalService
    {
        Task<bool> AddRfqFinal(RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto);
        Task<IEnumerable<VendorFinalizationResposeDto>> AwardedVendor(int id);
    }
}
