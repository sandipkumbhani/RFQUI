using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;

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
    }
}
