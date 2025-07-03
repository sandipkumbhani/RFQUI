using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class RfqResponceDto
    {
        public int CompanyId { get; set; }
        public int CustomerId { get; set; }
        public string? RfqNoPrefix { get; set; }
        public int RfqNo { get; set; }
        public DateTime RfqDate { get; set; }
        public string? RfqSubject { get; set; }
        public DateTime RfqExpiresOn { get; set; }
        public int RfqTypeId { get; set; }
        public DateTime VehicleReqNo { get; set; }
        public int RfqPriorityId { get; set; }
        public string? Remarks { get; set; }
        public int LinkId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
