using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Interface
{
    public interface IQuoteRateVendorService
    {
        Task<string> AddQuoteRateVendor(QuoteRateVendorRequestDto rfqRateRequestDto);
        Task<int> CheckFinalizationStatusOfRFQ(int rfqId);
    }
}
