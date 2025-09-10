using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.RequestDto
{
    public class QuoteRateVendorRequestDto
    {
        public int? RfqRateId { get; set; }
        public int? RfqId { get; set; }
        public int? VendorId { get; set; }
        public int? AvailVehicleCount { get; set; }
        public int? TotalHireCost { get; set; }
        public int? DetentionPerDay { get; set; }
        public int? DetentionFreeDays { get; set; }
        public DateTime? UpdatedOn { get; set; } = DateTime.Now;
    }
}
