using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class CompanyAndFranchiseListDto
    {
        public int CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public int CompanyTypeId { get; set; }
    }
}
