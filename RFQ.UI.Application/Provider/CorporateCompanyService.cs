using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Infrastructure.Provider;
using static RFQ.UI.Domain.Model.CorporateCompanyViewModel;



namespace RFQ.UI.Application.Provider
{
    public class CorporateCompanyService : ICorporateCompanyService
    {
        private readonly CorporateCompanyAdaptor _corporateCompanyAdaptor;
        public CorporateCompanyService(CorporateCompanyAdaptor corporateCompanyAdaptor)
        {
            _corporateCompanyAdaptor = corporateCompanyAdaptor;
        }

        public Task<string> AddCorporateCompany(CorporateCompanyViewModelDto corporateCompanyViewModelDto)
        {
           return _corporateCompanyAdaptor.AddCorporateCompany(corporateCompanyViewModelDto);
        }

        public Task<string> DeleteCorporateCompany(int companyId)
        {
            return _corporateCompanyAdaptor.DeleteCorporateCompany(companyId);
        }

        public Task<string> EditCorporateCompany(int companyId, CorporateCompanyViewModelDto corporateCompanyViewModelDto)
        {
            return _corporateCompanyAdaptor.EditCorporateCompany(companyId, corporateCompanyViewModelDto);
        }

        public Task<IEnumerable<CorporateCompanyViewModelDto>> GetCorporateCompanyAll()
        {
            return _corporateCompanyAdaptor.GetCorporateCompanyAll();
        }
    }
}
