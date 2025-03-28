using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;



namespace RFQ.UI.Application.Provider
{
    public class CorporateCompanyService : ICorporateCompanyService
    {
        private readonly CorporateCompanyAdaptor _corporateCompanyAdaptor;
        public CorporateCompanyService(CorporateCompanyAdaptor corporateCompanyAdaptor)
        {
            _corporateCompanyAdaptor = corporateCompanyAdaptor;
        }

        public Task<string> AddCorporateCompany(CorporateCompanyRequestDto corporateCompanyViewModelDto)
        {
           return _corporateCompanyAdaptor.AddCorporateCompany(corporateCompanyViewModelDto);
        }

        public Task<string> DeleteCorporateCompany(int companyId)
        {
            return _corporateCompanyAdaptor.DeleteCorporateCompany(companyId);
        }

        public Task<string> EditCorporateCompany(int companyId, CorporateCompanyRequestDto corporateCompanyViewModelDto)
        {
            return _corporateCompanyAdaptor.EditCorporateCompany(companyId, corporateCompanyViewModelDto);
        }

        public Task<IEnumerable<FranchiseListDto>> GetAllFranchise()
        {
            return _corporateCompanyAdaptor.GetAllFranchise();
        }

        public Task<IEnumerable<CorporateCompanyResponseDto>> GetCorporateCompanyAll()
        {
            return _corporateCompanyAdaptor.GetCorporateCompanyAll();
        }
    }
}
