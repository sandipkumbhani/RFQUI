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

        public async Task<CorporateCompanyRequestDto?> AddCorporateCompany(CorporateCompanyRequestDto corporateCompanyRequestDto)
        {
            return await  _corporateCompanyAdaptor.AddCorporateCompany(corporateCompanyRequestDto);
        }

        public Task<string> DeleteCorporateCompany(int companyId)
        {
            return _corporateCompanyAdaptor.DeleteCorporateCompany(companyId);
        }

        public Task<string> EditCorporateCompany(int companyId, CorporateCompanyRequestDto corporateCompanyRequestDto)
        {
            return _corporateCompanyAdaptor.EditCorporateCompany(companyId, corporateCompanyRequestDto);
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
