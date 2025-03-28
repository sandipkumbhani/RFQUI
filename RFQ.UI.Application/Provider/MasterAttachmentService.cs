using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
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
        public Task<string> AddMasterAttachment(MasterAttachmentRequestDto masterAttachmentRequestDto)
        {
            return _masterAttachmentAdaptor.AddMasterAttachment(masterAttachmentRequestDto);
        }

        public Task<IEnumerable<MasterAttachmentTypeResponseDto>> GetAllMasterAttachmentType()
        {
            return _masterAttachmentAdaptor.GetAllMasterAttachmentType();
        }
    }
}
