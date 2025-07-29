using RFQ.UI.Domain.RequestDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface IRfqRateServices
    {
        Task<RfqRateRequestDto> AddRfqRate(RfqRateRequestDto rfqRateRequestDto);
    }
}
