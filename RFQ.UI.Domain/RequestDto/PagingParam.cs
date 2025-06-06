using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.RequestDto
{
    public class PagingParam
    {
        public int draw { get; set; }
        public int start { get; set; }
        public int length { get; set; }
        public Search search { get; set; }
        public List<Order> order { get; set; }
        public List<Column> columns { get; set; }

        public class Search { public string value { get; set; } }
        public class Order { public int column { get; set; } public string dir { get; set; } }
        public class Column { public string data { get; set; } }

    }
}
