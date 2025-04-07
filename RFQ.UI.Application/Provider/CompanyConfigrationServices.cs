using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class CompanyConfigrationServices: ICompanyConfigurationServices
    {
        private readonly ICompanyConfigurationAdaptor _companyConfigurationAdaptor;
        public CompanyConfigrationServices(ICompanyConfigurationAdaptor companyConfigrationAdaptor)
        {
            _companyConfigurationAdaptor = companyConfigrationAdaptor ?? throw new ArgumentNullException(nameof(companyConfigrationAdaptor));
        }

        public async Task<IEnumerable<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration()
        {
            return await _companyConfigurationAdaptor.GetAllCompanyConfiguration();
        }
        public async Task<IEnumerable<FranchiseResponseDto>> GetAllCompany()
        {
            return await _companyConfigurationAdaptor.GetAllCompany();
        }
        public async Task<IEnumerable<ProviderResponseDto>> GetAllProviders()
        {
            return await _companyConfigurationAdaptor.GetAllProviders();
        }
        public Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto requestDto)
        {
            return _companyConfigurationAdaptor.AddCompanyConfiguration(requestDto);
        }
        public Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto requestDto)
        {
            return _companyConfigurationAdaptor.EditCompanyConfiguration(requestDto);
        }
    }
}
