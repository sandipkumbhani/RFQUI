using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IQuoteRateVendorAdaptor
    {
        Task<string> AddQuoteRateVendor(QuoteRateVendorRequestDto rfqRateRequestDto);
    }
}
