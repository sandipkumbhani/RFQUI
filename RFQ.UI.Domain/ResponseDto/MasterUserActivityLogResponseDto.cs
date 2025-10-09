using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class MasterUserActivityLogResponseDto
    {
        public int UserActivityLogId { get; set; }
        public int LogUid { get; set; }
        public int LogLinkId { get; set; }
        public string LinkName { get; set; }
        public int LogTypeId { get; set; }
        public string InternalMasterName { get; set; }
        public int UserId { get; set; }
        public string PersonName { get; set; }
        public DateTime LogDateTime { get; set; }
        public string? Description { get; set; }

    }
}
