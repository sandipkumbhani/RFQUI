using RFQ.UI.Domain.RequestDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRfqLinkAdaptor
    {
        Task<bool> AddRfqLinkData(List<RfqLinkRequestDto> rfqLinkRequestDto);
    }
}
