using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVendorAdaptor
    {
        Task<NewCommonResponseDto> AddVendor(VendorRequestDto vendorRequestDto);
        Task<PageList<VendorResponseDto>> GetAllVendor(PagingParam pagingParam);
        Task<string> EditVendor(int PartyId, VendorRequestDto vendorRequestDto);
        Task<string> DeleteVendor(int PartyId);
        Task<IEnumerable<InternalMasterResponseDto>> GetAllInternalMaster();
        Task<IEnumerable<VendorListResponseDto>?> GetAllVendorList(int companyId);
    }
}
