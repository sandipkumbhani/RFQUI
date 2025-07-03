using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class BranchService : IBranchService
    {
        private readonly BranchAdaptor _branchAdaptor;
        public BranchService(BranchAdaptor branchAdaptor)
        {
            _branchAdaptor = branchAdaptor;    
        }
        public Task<List<VendorListResponseDto>> GetAllVendorList()
        {
            return _branchAdaptor.GetAllVendorList();
        }
    }
}
