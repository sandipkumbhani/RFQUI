using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ICompanyConfigurationAdaptor
    {
        Task<PageList<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration(PagingParam pagingParam);
        Task<IEnumerable<FranchiseResponseDto>> GetAllCompany();
        Task<IEnumerable<ProviderResponseDto>> GetAllProviders();
        Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto);
        Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto);
        Task<string> DeleteCompanyConfiguration(int companyConfigId);
    }
}
