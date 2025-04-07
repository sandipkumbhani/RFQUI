using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface ICompanyConfigurationServices
    {
        Task<IEnumerable<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration();
        Task<IEnumerable<FranchiseResponseDto>> GetAllCompany();
        Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto requestDto);

        Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto requestDto);
    }
}
