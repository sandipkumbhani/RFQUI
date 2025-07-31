using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class RfqPreviousQuotesList
    {
        public string? PartyName { get; set; }
        public string? PANNo { get; set; }
        public string? VendorRating { get; set; }
        public string? RfqDate { get; set; }
        public int? TotalHireCost { get; set; }
    }
}
