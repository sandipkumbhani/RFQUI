using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class VendorService : IVendorService
    {
        private readonly IVendorAdaptor _vendorAdaptor;
        public VendorService(IVendorAdaptor vendorAdaptor)
        {
            _vendorAdaptor = vendorAdaptor;
        }

        public async Task<NewCommonResponseDto?> AddVendor(VendorRequestDto vendorRequestDto)
        {
            return await _vendorAdaptor.AddVendor(vendorRequestDto);
        }

        public async Task<string> DeleteVendor(int PartyId)
        {
            return await _vendorAdaptor.DeleteVendor(PartyId);
        }

        public async Task<string> EditVendor(int PartyId, VendorRequestDto vendorRequestDto)
        {
            return await _vendorAdaptor.EditVendor(PartyId, vendorRequestDto);
        }

        public async Task<IEnumerable<InternalMasterResponseDto>> GetAllInternalMaster()
        {
            return await _vendorAdaptor.GetAllInternalMaster();
        }
        public async Task<IEnumerable<VendorListResponseDto>> GetAllVendorList(int companyId)
        {
            return await _vendorAdaptor.GetAllVendorList(companyId);
        }

        public async Task<PageList<VendorResponseDto>> GetAllVendor(PagingParam pagingParam)
        {
            return await _vendorAdaptor.GetAllVendor(pagingParam);
        }
    }
}
