using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface ICompanyConfigurationServices
    {
        Task<IEnumerable<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration();
        Task<IEnumerable<FranchiseResponseDto>> GetAllCompany();
        Task<IEnumerable<ProviderResponseDto>> GetAllProviders();
        Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto requestDto);
        Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto requestDto);
    }
}
