using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class QuoteRateVendorService : IQuoteRateVendorService
    {
        private readonly QuoteRateVendorAdaptor _rfqRateAdaptor;

        public QuoteRateVendorService(QuoteRateVendorAdaptor rfqRateAdaptor)
        {
            _rfqRateAdaptor = rfqRateAdaptor;
        }
        public Task<string> AddQuoteRateVendor(QuoteRateVendorRequestDto rfqRateRequestDto)
        {
            return _rfqRateAdaptor.AddQuoteRateVendor(rfqRateRequestDto);
        }
    }
}
