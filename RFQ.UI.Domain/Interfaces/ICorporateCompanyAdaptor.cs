using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using static RFQ.UI.Domain.Model.CorporateCompanyModel;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ICorporateCompanyAdaptor
    {
        Task<string> AddCorporateCompany(CorporateCompanyRequestDto requestDto);

        Task<IEnumerable<CorporateCompanyModel>> GetCorporateCompanyAll();

        Task<string> EditCorporateCompany(int companyId, CorporateCompanyRequestDto requestDto);

        Task<string> DeleteCorporateCompany(int companyId);

        Task<IEnumerable<FranchiseListDto>> GetAllFranchise();
    }
}
