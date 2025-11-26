using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ICorporateCompanyService
    {
        Task<CorporateCompanyRequestDto?> AddCorporateCompany(CorporateCompanyRequestDto corporateCompanyRequestDto);

        Task<PageList<CorporateCompanyResponseDto>> GetCorporateCompanyAll(PagingParam pagingParam);

        Task<bool> EditCorporateCompany(int companyId, CorporateCompanyRequestDto corporateCompanyRequestDto);

        Task<string> DeleteCorporateCompany(int companyId);

        Task<IEnumerable<FranchiseListDto>> GetAllFranchise();
    }
}
