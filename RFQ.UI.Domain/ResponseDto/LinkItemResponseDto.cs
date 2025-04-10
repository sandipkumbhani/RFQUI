using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class LinkItemResponseDto
    {
        public int LinkId { get; set; }
        public string LinkName { get; set; }
        public string ListingQuery { get; set; }
        public string GroupId { get; set; }
        public string LinkIcon { get; set; }
        public string SequenceNo { get; set; }
        public string LinkUrl { get; set; }
        public string AddUrl { get; set; }
        public string EditUrl { get; set; }
        public string CancelUrl { get; set; }
        public int StatusId { get; set; } 
    }
}
