using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRfqBranchAdaptor
    {
        Task<RfqBranchRequestDto?> AddRfqBranch(RfqBranchRequestDto RfqRequestDto);

        Task<List<RfqBranchResponceDto>> GetAllRfqBranchList();

    }
}
