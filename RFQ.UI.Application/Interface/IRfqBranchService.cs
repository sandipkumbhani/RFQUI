using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface IRfqBranchService
    {
        Task<RfqBranchRequestDto?> AddRfqBranch(RfqBranchRequestDto rfqRequestDto);
        Task<List<RfqBranchResponceDto>> GetAllRfqBranchList();

        //Task<IEnumerable<RfqResponseDto>> GetAllRfq();
        //Task<RfqResponseDto?> GetRfqById(int rfqId);
        //Task<string> EditRfq(int rfqId, RfqBranchRequestDto rfqRequestDto);
        //Task<string> DeleteRfq(int rfqId);
    }
}
