using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static RFQ.UI.Domain.Model.CorporateCompanyViewModel;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ICorporateCompanyAdaptor
    {
        Task<string> AddCorporateCompany(CorporateCompanyViewModelDto corporateCompanyViewModelDto);

        Task<IEnumerable<CorporateCompanyViewModelDto>> GetCorporateCompanyAll();

        Task<string> EditCorporateCompany(int companyId, CorporateCompanyViewModelDto corporateCompanyViewModelDto);

        Task<string> DeleteCorporateCompany(int companyId);
    }
}
