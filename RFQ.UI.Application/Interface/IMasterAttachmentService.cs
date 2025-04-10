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
        Task<string> AddMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto);

        Task<IEnumerable<MasterAttachmentRequestDto>> GetAllMasterAttachment();

        Task<IEnumerable<MasterAttachmentTypeResponseDto>> GetAllMasterAttachmentType();

        Task<string> UpdateMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto);

        Task<string> DeleteMasterAttachment(int attachmentId);

        Task<string> DeleteMasterAttachmentTable(int attachmentId);
    }
}
