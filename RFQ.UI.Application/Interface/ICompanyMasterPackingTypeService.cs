using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface ICompanyMasterPackingTypeService
    {
        Task<string> AddMasterPackingType(CompanyMasterPackingTypeRequestDto companyMasterPackingTypeRequestDto);

        Task<IEnumerable<CompanyMasterPackingTypeResponseDto>> GetAllMasterPackingType();

    }
}
