using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Interface
{
    public interface IRFQVendorServices
    {
        Task<bool> AddRfqVendor(RfqVendorRequestDto rfqVendorRequestDto);
        Task<string> GetRfqNo();
    }
}
