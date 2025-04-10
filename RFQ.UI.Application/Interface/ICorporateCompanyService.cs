using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ICorporateCompanyService
    {
        Task<string> AddCorporateCompany(CorporateCompanyRequestDto requestDto);

        Task<IEnumerable<CorporateCompanyModel>> GetCorporateCompanyAll();

        Task<string> EditCorporateCompany(int companyId, CorporateCompanyRequestDto requestDto);

        Task<string> DeleteCorporateCompany(int companyId);

        Task<IEnumerable<FranchiseListDto>> GetAllFranchise();
    }
}
