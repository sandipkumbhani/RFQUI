using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IQuoteRateVendorService
    {
        Task<string> AddQuoteRateVendor(QuoteRateVendorRequestDto rfqRateRequestDto);
    }
}
