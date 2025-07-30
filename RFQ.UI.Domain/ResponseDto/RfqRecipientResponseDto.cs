using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class RfqRecipientResponseDto
    {
        public int RfqRecipientId { get; set; }
        public int RfqId { get; set; }
        public int VendorId { get; set; }
        public string PanNo { get; set; }
        public int VendorRating { get; set; }
        public string MobNo { get; set; }
        public string WhatsAppNo { get; set; }
        public string EmailId { get; set; }
    }
}
