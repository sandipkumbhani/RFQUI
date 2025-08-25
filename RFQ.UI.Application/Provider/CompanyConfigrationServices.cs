using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class CompanyConfigrationServices : ICompanyConfigurationServices
    {
        private readonly ICompanyConfigurationAdaptor _companyConfigurationAdaptor;
        public CompanyConfigrationServices(ICompanyConfigurationAdaptor companyConfigrationAdaptor)
        {
            _companyConfigurationAdaptor = companyConfigrationAdaptor ?? throw new ArgumentNullException(nameof(companyConfigrationAdaptor));
        }

        public async Task<PageList<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration(PagingParam pagingParam)
        {
            return await _companyConfigurationAdaptor.GetAllCompanyConfiguration(pagingParam);
        }
        public async Task<IEnumerable<FranchiseResponseDto>> GetAllCompany()
        {
            return await _companyConfigurationAdaptor.GetAllCompany();
        }
        public async Task<IEnumerable<ProviderResponseDto>> GetAllProviders()
        {
            return await _companyConfigurationAdaptor.GetAllProviders();
        }
        public Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto)
        {
            return _companyConfigurationAdaptor.AddCompanyConfiguration(companyConfigrationRequestDto);
        }
        public Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto)
        {
            return _companyConfigurationAdaptor.EditCompanyConfiguration(companyConfigrationRequestDto);
        }
        public  async Task<string> DeleteCompanyConfiguration(int companyConfigId)
        {
            return await _companyConfigurationAdaptor.DeleteCompanyConfiguration(companyConfigId);
        }
    }
}
