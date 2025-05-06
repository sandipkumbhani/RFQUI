using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IMasterAttachmentAdaptor
    {
        Task<string> AddMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto);

        Task<IEnumerable<MasterAttachmentRequestDto>> GetAllMasterAttachment();

        Task<IEnumerable<MasterAttachmentTypeResponseDto>> GetAllMasterAttachmentType();

        Task<string> UpdateMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto);

        Task<IEnumerable<MasterAttachmentResponseDto>> DeleteMasterAttachment(int attachmentId);
        Task<string> DeleteMasterAttachmentTable(int attachmentId);



    }
}
