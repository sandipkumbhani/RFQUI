using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class MasterAttachmentTypeResponseDto
    {
        public int AttachmentTypeId { get; set; }

        public string? AttachmentTypeName { get; set; }

        public int LinId { get; set; }
    }
}
