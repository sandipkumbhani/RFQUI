using RFQ.UI.Domain.RequestDto;
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


    }
}
