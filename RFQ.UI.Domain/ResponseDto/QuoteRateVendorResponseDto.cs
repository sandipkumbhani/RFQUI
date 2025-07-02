using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class QuoteRateVendorResponseDto
    {
        public int RfqDetailId { get; set; }

        public int VendorId { get; set; }

        public int LocationId { get; set; }

        public int TotalHireCost { get; set; }

        public int DetentionPerDay { get; set; }

        public int DetentionFreeDay { get; set; }

        public DateTime UpdatedOn { get; set; }
    }
}
