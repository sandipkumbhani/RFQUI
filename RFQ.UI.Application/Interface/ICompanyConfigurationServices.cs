using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ICompanyConfigurationServices
    {
        Task<IEnumerable<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration();
        Task<IEnumerable<FranchiseResponseDto>> GetAllCompany();
        Task<IEnumerable<ProviderResponseDto>> GetAllProviders();
        Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto);
        Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto);
        Task<string> DeleteCompanyConfiguration(int companyConfigId);
    }
}
