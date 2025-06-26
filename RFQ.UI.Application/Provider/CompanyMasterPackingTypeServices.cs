using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class CompanyMasterPackingTypeServices : ICompanyMasterPackingTypeService
    {
        private readonly CompanyMasterPackingTypeAdaptor _companyMasterPackingTypeAdaptor;
        public CompanyMasterPackingTypeServices(CompanyMasterPackingTypeAdaptor companyMasterPackingTypeAdaptor)
        {
            _companyMasterPackingTypeAdaptor = companyMasterPackingTypeAdaptor;
        }

        public async Task<string> AddMasterPackingType(CompanyMasterPackingTypeRequestDto companyMasterPackingTypeRequestDto)
        {
            return await _companyMasterPackingTypeAdaptor.AddMasterPackingType(companyMasterPackingTypeRequestDto);
        }

        public Task<IEnumerable<CompanyMasterPackingTypeResponseDto>> GetAllMasterPackingType()
        {
            return _companyMasterPackingTypeAdaptor.GetAllMasterPackingType();
        }
    }
}
