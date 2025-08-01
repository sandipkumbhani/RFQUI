using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Provider
{
   public class RfqLinkService : IRfqLinkService
    {
        private readonly IRfqLinkAdaptor _rfqLinkAdaptor;
        public RfqLinkService(IRfqLinkAdaptor rfqLinkAdaptor)
        {
            _rfqLinkAdaptor  = rfqLinkAdaptor;
        }
        public Task<bool> AddRfqLinkData(List<RfqLinkRequestDto> rfqLinkRequestDto)
        {
            return _rfqLinkAdaptor.AddRfqLinkData(rfqLinkRequestDto);
        }
    }
}
