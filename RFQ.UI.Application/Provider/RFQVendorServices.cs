using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class RFQVendorServices : IRFQVendorServices
    {
        private readonly IRFQVendorAdaptor _rFQVendorAdaptor;
        public RFQVendorServices(IRFQVendorAdaptor rFQVendorAdaptor)
        {
            _rFQVendorAdaptor  = rFQVendorAdaptor;
        }
        public Task<bool> AddRfqVendor(RfqVendorRequestDto rfqVendorRequestDto)
        {
            return _rFQVendorAdaptor.AddRfqVendor(rfqVendorRequestDto);
        }
    }
}
