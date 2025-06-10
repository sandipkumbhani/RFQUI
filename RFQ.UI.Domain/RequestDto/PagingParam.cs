using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.RequestDto
{
    public class PagingParam
    {
        public int Draw { get; set; }
        public int Start { get; set; }
        public int Length { get; set; }
        public string SearchValue { get; set; }
        public string OrderColumn { get; set; }
        public string OrderDir { get; set; }
    }
}
