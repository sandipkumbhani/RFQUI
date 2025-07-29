using RFQ.UI.Domain.RequestDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRfqRateAdaptor
    {
        Task<RfqRateRequestDto> AddRfqRate(RfqRateRequestDto rfqRateRequestDto);
    }
}
