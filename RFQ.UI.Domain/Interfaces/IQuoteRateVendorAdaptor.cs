using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IQuoteRateVendorAdaptor
    {
        Task<string> AddQuoteRateVendor(QuoteRateVendorRequestDto rfqRateRequestDto);
        Task<int> CheckFinalizationStatusOfRFQ(int rfqId);
    }
}
