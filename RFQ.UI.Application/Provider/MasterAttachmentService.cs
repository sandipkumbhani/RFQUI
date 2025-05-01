using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class MasterAttachmentService : IMasterAttachmentService
    {
        private readonly MasterAttachmentAdaptor _masterAttachmentAdaptor;

        public MasterAttachmentService(MasterAttachmentAdaptor masterAttachmentAdaptor)
        {
            _masterAttachmentAdaptor = masterAttachmentAdaptor;
        }
        public Task<string> AddMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto)
        {
            return _masterAttachmentAdaptor.AddMasterAttachment(masterAttachmentRequestDto);
        }

        public Task<IEnumerable<MasterAttachmentRequestDto>> GetAllMasterAttachment()
        {
            return _masterAttachmentAdaptor.GetAllMasterAttachment();
        }

        public Task<IEnumerable<MasterAttachmentTypeResponseDto>> GetAllMasterAttachmentType()
        {
            return _masterAttachmentAdaptor.GetAllMasterAttachmentType();
        }

        public Task<string> UpdateMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto)
        {
            return _masterAttachmentAdaptor.UpdateMasterAttachment(masterAttachmentRequestDto);
        }

        public Task<IEnumerable<MasterAttachmentResponseDto>> DeleteMasterAttachment(int attachmentId)
        {
            return _masterAttachmentAdaptor.DeleteMasterAttachment(attachmentId);
        }

        public Task<string> DeleteMasterAttachmentTable(int attachmentId)
        {
            return _masterAttachmentAdaptor.DeleteMasterAttachmentTable(attachmentId);
        }


    }
}
