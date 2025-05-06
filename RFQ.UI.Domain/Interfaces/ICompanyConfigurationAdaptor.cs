using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ICompanyConfigurationAdaptor
    {
        Task<IEnumerable<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration();
        Task<IEnumerable<FranchiseResponseDto>> GetAllCompany();
        Task<IEnumerable<ProviderResponseDto>> GetAllProviders();
        Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto);
        Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto);
        Task<string> DeleteCompanyConfiguration(int companyConfigId);
    }
}
