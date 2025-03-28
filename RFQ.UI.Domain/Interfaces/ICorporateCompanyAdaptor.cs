using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;


namespace RFQ.UI.Domain.Interfaces
{
    public interface ICorporateCompanyAdaptor
    {
        Task<string> AddCorporateCompany(CorporateCompanyRequestDto corporateCompanyViewModelDto);

        Task<IEnumerable<CorporateCompanyResponseDto>> GetCorporateCompanyAll();

        Task<string> EditCorporateCompany(int companyId, CorporateCompanyRequestDto corporateCompanyViewModelDto);

        Task<string> DeleteCorporateCompany(int companyId);

        Task<IEnumerable<FranchiseListDto>> GetAllFranchise();
    }
}
