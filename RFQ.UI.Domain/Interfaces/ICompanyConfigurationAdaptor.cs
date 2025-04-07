using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ICompanyConfigurationAdaptor
    {
        Task<IEnumerable<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration();
        Task<IEnumerable<FranchiseResponseDto>> GetAllCompany();
        Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto requestDto);
        Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto requestDto);
    }
}
