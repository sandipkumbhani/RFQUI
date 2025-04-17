using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVendorAdaptor
    {
        Task<VendorRequestDto> AddVendor(VendorRequestDto vendorRequestDto);

        Task<IEnumerable<VendorResponseDto>> GetAllVendor();

        Task<string> EditVendor(int PartyId, VendorRequestDto vendorRequestDto);

        Task<string> DeleteVendor(int PartyId);
        Task<IEnumerable<InternalMasterResponseDto>> GetAllInternalMaster();

    }
}
