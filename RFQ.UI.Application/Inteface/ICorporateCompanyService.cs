using static RFQ.UI.Domain.Model.CorporateCompanyViewModel;

namespace RFQ.UI.Application.Inteface
{
    public interface ICorporateCompanyService
    {
        Task<string> AddCorporateCompany(CorporateCompanyViewModelDto corporateCompanyViewModelDto);

        Task<IEnumerable<CorporateCompanyViewModelDto>> GetCorporateCompanyAll();

        Task<string> EditCorporateCompany(int companyId, CorporateCompanyViewModelDto corporateCompanyViewModelDto);

        Task<string> DeleteCorporateCompany(int companyId);
    }
}
