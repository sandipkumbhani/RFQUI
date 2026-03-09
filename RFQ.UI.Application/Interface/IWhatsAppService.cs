using RFQ.UI.Domain.RequestDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface IWhatsAppService
    {
        Task<string> SendMessageAsync(WhatsAppRequestDto requestDto);
    }
}
