using RFQ.UI.Application.Interface;
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
        public async Task<RfqFinalRequestDto> AddRfqFinal(RfqFinalRequestDto rfqFinalRequestDto)
        {
            return await _rfqFinalAdaptor.AddRfqFinal(rfqFinalRequestDto);
        }

        public async Task<IEnumerable<VendorFinalizationResposeDto>> AwardedVendor(int id)
        {
            return await _rfqFinalAdaptor.AwardedVendor(id);
        }
    }
}
