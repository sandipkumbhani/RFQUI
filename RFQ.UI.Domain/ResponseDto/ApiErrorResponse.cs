using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class ApiErrorResponse
    {
        public int statusCode { get; set; }
        public string data { get; set; }
        public string message { get; set; }
        public string errorMessage { get; set; }
    }
}
