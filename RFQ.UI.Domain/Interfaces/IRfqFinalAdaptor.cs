using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRfqFinalAdaptor
    {
        Task<bool> AddRfqFinal(RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto);
        Task<IEnumerable<VendorFinalizationResposeDto>> AwardedVendor(int id);
    }
}
