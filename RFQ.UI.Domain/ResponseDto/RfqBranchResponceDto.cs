using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class RfqBranchResponceDto
    {
        public int RfqId { get; set; }
        public int CompanyId { get; set; }
        public int RfqCategoryId { get; set; }
        public int CustomerId { get; set; }
        public string? RfqNoPrefix { get; set; }
        public int RfqNo { get; set; }
        public DateTime RfqDate { get; set; }
        public string? RfqSubject { get; set; }
        public DateTime RfqExpiresOn { get; set; }
        public int RfqTypeId { get; set; }
        public DateTime VehicleReqOn { get; set; }
        public int RfqPriorityId { get; set; }
        public string? Remarks { get; set; }
        public int LinkId { get; set; }
        public int? StatusId { get; set; } = 30;
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; } = DateTime.Now;
        public int RfqDetailId { get; set; }
        public string FromLoc { get; set; }
        public string FromLocLat { get; set; }
        public string FromLocLong { get; set; }
        public string ToLoc { get; set; }
        public string ToLocLat { get; set; }
        public string ToLocLong { get; set; }
        public int RfqOnId { get; set; }
        public int VehicleTypeId { get; set; }
        public int VehicleCount { get; set; }
        public int TotalQty { get; set; }
        public int ItemId { get; set; }
        public int MaxCosting { get; set; }
        public int DetentionPerDay { get; set; }
        public int DetentionFreeDays { get; set; }
        public int PackingTypeId { get; set; }
        public string SpecialInstruction { get; set; }
    }
}
