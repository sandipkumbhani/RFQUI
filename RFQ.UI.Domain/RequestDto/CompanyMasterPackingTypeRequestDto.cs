using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.RequestDto
{
    public class CompanyMasterPackingTypeRequestDto
    {
        public int PackingId { get; set; }
        public string? PackingName { get; set; }
        public string? Description { get; set; }
    }
}
