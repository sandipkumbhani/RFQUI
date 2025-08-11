using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public class ReceivedVendorCostingService : IReceivedVendorCostingService
    {
        public readonly IReceivedVendorCostingAdaptor _receivedVendorCostingAdaptor;

        public ReceivedVendorCostingService(IReceivedVendorCostingAdaptor receivedVendorCostingAdaptor)
        {
            _receivedVendorCostingAdaptor = receivedVendorCostingAdaptor;
        }

        public async Task<IEnumerable<VendorCostingList>> GetAllReceivedVendorCosting(ReceivedVendorCosting request)
        {
            return await _receivedVendorCostingAdaptor.GetAllReceivedVendorCosting(request);
        }

    }
}
