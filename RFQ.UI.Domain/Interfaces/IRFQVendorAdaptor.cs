using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRFQVendorAdaptor
    {
        Task<bool> AddRfqVendor(RfqVendorRequestDto requestDto);
    }
}
