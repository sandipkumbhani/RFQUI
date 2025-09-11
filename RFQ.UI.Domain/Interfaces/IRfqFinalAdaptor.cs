using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRfqFinalAdaptor
    {
        Task<bool> AddRfqFinal(RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto);
        Task<bool> UpdateRfqFinal(int rfqFinalId,RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto);
        Task<bool> DeleteRfqFinal(int rfqFinalId);
        Task<IEnumerable<VendorFinalizationResposeDto>> AwardedVendor(int id);
        Task<PageList<RfqFinalizationResponseDto>> GetAllRfqFinalization(PagingParam pagingParam);
        Task<IEnumerable<RfqFinalRateReponseDto>> GetRfqFinalRateList(int rfqFinalId);
        Task<IEnumerable<RfqDrpListResponseDto>> GetRfqDrpList(int companyId);
    }
}
