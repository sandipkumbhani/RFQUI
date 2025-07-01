using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface IBranchService
    {
        Task<List<VendorListResponseDto>> GetAllVendorList();
    }
}
