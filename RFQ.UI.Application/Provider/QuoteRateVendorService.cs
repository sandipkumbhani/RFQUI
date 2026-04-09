using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class QuoteRateVendorService : IQuoteRateVendorService
    {
        private readonly QuoteRateVendorAdaptor _rfqRateAdaptor;

        public QuoteRateVendorService(QuoteRateVendorAdaptor rfqRateAdaptor)
        {
            _rfqRateAdaptor = rfqRateAdaptor;
        }
        public Task<string> AddQuoteRateVendor(QuoteRateVendorRequestDto rfqRateRequestDto)
        {
            return _rfqRateAdaptor.AddQuoteRateVendor(rfqRateRequestDto);
        }
        public async Task<int> CheckFinalizationStatusOfRFQ(int rfqId)
        {
            return await _rfqRateAdaptor.CheckFinalizationStatusOfRFQ(rfqId);
        }
    }
}
