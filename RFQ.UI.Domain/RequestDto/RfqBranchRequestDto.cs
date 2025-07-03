using RFQ.UI.Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.RequestDto
{
    public class RfqBranchRequestDto
    {
        public RfqBranchRequestDto()
        {
            Rfq = new();
            RfqDetails = new();
            rfqRecipients = new();
        }
        public RfqDto Rfq { get; set; }
        public RfqDetailDto RfqDetails { get; set; }
        public List<RfqRecipient> rfqRecipients { get; set; }
    }
}
