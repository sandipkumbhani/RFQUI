using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Infrastructure.Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class RfqBranchService : IRfqBranchService
    {
        private readonly RfqBranchAdaptor _rfqAdaptor;
        public RfqBranchService(RfqBranchAdaptor rfqAdaptor)
        {
            _rfqAdaptor = rfqAdaptor;
        }
        public async Task<RfqBranchRequestDto?> AddRfqBranch(RfqBranchRequestDto rfqRequestDto)
        {
            return await _rfqAdaptor.AddRfqBranch(rfqRequestDto);
        }
    }
}
