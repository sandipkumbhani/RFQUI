using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.Model
{
    public class InternalMasterViewModel
    {
        public InternalMasterViewModel()
        {
            internalMasterDtos = new();
        }
        public InternalMasterDto internalMasterDtos { get; set; }
    }
    public class InternalMasterDto
    {
        public int InternalMasterId { get; set; }
        public int InternalMasterTypeId { get; set; }
        public string? InternalMasterName { get; set; }
    }
}
