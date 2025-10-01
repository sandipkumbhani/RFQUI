using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.RequestDto
{
    public class MasterUserActivityLogRequestDto
    {
        //public int? UserActivityLogId { get; set; }

        public int? LogUid { get; set; }

        public int? LogLinkId { get; set; }

        public int? LogTypeId { get; set; }

        public int? UserId { get; set; }

        public DateTime? LogDateTime { get; set; }

        public string? Description { get; set; }

    }
}
