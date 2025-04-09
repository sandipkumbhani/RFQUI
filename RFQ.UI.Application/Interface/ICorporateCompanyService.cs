using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ICorporateCompanyService
    {
        Task<string> AddCorporateCompany(CorporateCompanyModel requestDto);

        Task<IEnumerable<CorporateCompanyModel>> GetCorporateCompanyAll();

        Task<string> EditCorporateCompany(int companyId, CorporateCompanyModel requestDto);

        Task<string> DeleteCorporateCompany(int companyId);

        Task<IEnumerable<FranchiseListDto>> GetAllFranchise();
    }
}
