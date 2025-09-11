using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class RfqFinalService : IRfqFinalService
    {
        private readonly IRfqFinalAdaptor _rfqFinalAdaptor;
        public RfqFinalService(IRfqFinalAdaptor rfqFinalAdaptor)
        {
            _rfqFinalAdaptor = rfqFinalAdaptor;
        }
        public async Task<bool> AddRfqFinal(RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto)
        {
            return await _rfqFinalAdaptor.AddRfqFinal(rfqFinalizationSaveRequestDto);
        }

        public async Task<IEnumerable<VendorFinalizationResposeDto>> AwardedVendor(int id)
        {
            return await _rfqFinalAdaptor.AwardedVendor(id);
        }

        public async Task<bool> DeleteRfqFinal(int rfqFinalId)
        {
            return await _rfqFinalAdaptor.DeleteRfqFinal(rfqFinalId);
        }

        public async Task<PageList<RfqFinalizationResponseDto>> GetAllRfqFinalization(PagingParam pagingParam)
        {
            return await _rfqFinalAdaptor.GetAllRfqFinalization(pagingParam);
        }

        public async Task<IEnumerable<RfqDrpListResponseDto>> GetRfqDrpList(int companyId)
        {
            return await _rfqFinalAdaptor.GetRfqDrpList(companyId);
        }

        public async Task<IEnumerable<RfqFinalRateReponseDto>> GetRfqFinalRateList(int rfqFinalId)
        {
            return await _rfqFinalAdaptor.GetRfqFinalRateList(rfqFinalId);
        }

        public async Task<bool> UpdateRfqFinal(int rfqFinalId, RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto)
        {
            return await _rfqFinalAdaptor.UpdateRfqFinal(rfqFinalId, rfqFinalizationSaveRequestDto);
        }
    }
}
