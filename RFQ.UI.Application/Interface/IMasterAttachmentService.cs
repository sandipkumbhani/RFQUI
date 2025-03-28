using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IMasterAttachmentService
    {
        Task<string> AddMasterAttachment(MasterAttachmentRequestDto masterAttachmentRequestDto);
        
        Task<IEnumerable<MasterAttachmentTypeResponseDto>> GetAllMasterAttachmentType();
    }
}
