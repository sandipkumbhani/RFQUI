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
    public class RfqRateServices : IRfqRateServices
    {
        private readonly IRfqRateAdaptor _rfqRateAdaptor;
        public RfqRateServices(IRfqRateAdaptor rfqRateAdaptor)
        {
            _rfqRateAdaptor = rfqRateAdaptor;
        }

        public async Task<RfqRateRequestDto> AddRfqRate(RfqRateRequestDto rfqRateRequestDto)
        {
            return await _rfqRateAdaptor.AddRfqRate(rfqRateRequestDto);
        }
    }
}
