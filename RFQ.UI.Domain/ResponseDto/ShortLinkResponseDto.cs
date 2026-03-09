using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class ShortLinkResponseDto
    {
        public int MessageId { get; set; }
        public string MessageDescription { get; set; }
        public string ShortUrl { get; set; }
        public string LongUrl { get; set; }
    }
}
