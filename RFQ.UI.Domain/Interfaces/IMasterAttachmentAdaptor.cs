using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IMasterAttachmentAdaptor
    {
        Task<string> AddMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto);

        Task<IEnumerable<MasterAttachmentRequestDto>> GetAllMasterAttachment();

        Task<IEnumerable<MasterAttachmentTypeResponseDto>> GetAllMasterAttachmentType();

        Task<string> UpdateMasterAttachment(int attachmentId, MasterAttachmentRequestDto masterAttachmentRequestDto);

        Task<string> DeleteMasterAttachment(int attachmentId);

        

    }
}
