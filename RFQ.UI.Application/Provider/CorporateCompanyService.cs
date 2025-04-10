using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;
using static RFQ.UI.Domain.Model.CorporateCompanyModel;



namespace RFQ.UI.Application.Provider
{
    public class CorporateCompanyService : ICorporateCompanyService
    {
        private readonly CorporateCompanyAdaptor _corporateCompanyAdaptor;
        public CorporateCompanyService(CorporateCompanyAdaptor corporateCompanyAdaptor)
        {
            _corporateCompanyAdaptor = corporateCompanyAdaptor;
        }

        public Task<string> AddCorporateCompany(CorporateCompanyModel requestDto)
        {
            return _corporateCompanyAdaptor.AddCorporateCompany(requestDto);
        }

        public Task<string> DeleteCorporateCompany(int companyId)
        {
            return _corporateCompanyAdaptor.DeleteCorporateCompany(companyId);
        }

        public Task<string> EditCorporateCompany(int companyId, CorporateCompanyModel requestDto)
        {
            return _corporateCompanyAdaptor.EditCorporateCompany(companyId, requestDto);
        }

        public Task<IEnumerable<FranchiseListDto>> GetAllFranchise()
        {
            return _corporateCompanyAdaptor.GetAllFranchise();
        }

        public Task<IEnumerable<CorporateCompanyModel>> GetCorporateCompanyAll()
        {
            return _corporateCompanyAdaptor.GetCorporateCompanyAll();
        }
    }
}
