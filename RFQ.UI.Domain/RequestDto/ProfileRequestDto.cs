using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.RequestDto
{
    public class ProfileRequestDto
    {
        public int ProfileId { get; set; }
        public string? ProfileName { get; set; }
        public int CompanyTypeId { get; set; }
    }
}
