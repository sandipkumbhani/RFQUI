using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ICompanyConfigurationAdaptor
    {
        Task<IEnumerable<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration();
        Task<IEnumerable<FranchiseResponseDto>> GetAllCompany();
        Task<IEnumerable<ProviderResponseDto>> GetAllProviders();
        Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto requestDto);
        Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto requestDto);
        Task<string> DeleteCompanyConfiguration(int companyConfigId);
    }
}
