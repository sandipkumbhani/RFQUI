using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IMasterAttachmentAdaptor
    {
        Task<string> AddMasterAttachment(MasterAttachmentRequestDto masterAttachmentRequestDto);

        Task<IEnumerable<MasterAttachmentTypeResponseDto>> GetAllMasterAttachmentType();

        //Task<string> EditCorporateCompany(int companyId, CorporateCompanyRequestDto corporateCompanyViewModelDto);

        //Task<string> DeleteCorporateCompany(int companyId);

        //Task<IEnumerable<FranchiseListDto>> GetAllFranchise();

    }
}
