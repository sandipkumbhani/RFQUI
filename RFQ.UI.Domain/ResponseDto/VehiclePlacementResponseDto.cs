using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class VehiclePlacementResponseDto
    {
        public int PlacementId { get; set; }
        public string PlacementNo { get; set; }
        public int CompanyId { get; set; }
        public int LocationId { get; set; }
        public string? LocationName { get; set; }
        public DateTime PlacementDate { get; set; }
        public int IndentId { get; set; }
        public string IndentNo { get; set; }
        public int VehicleId { get; set; }
        public string VehicleNo { get; set; }
        public int TrackingTypeId { get; set; }
        public string InternalMasterName { get; set; }
        public int DriverId { get; set; }
        public string DriverName { get; set; }
        public string MobileNo { get; set; }
        public int OwnerVendorId { get; set; }
        public string OwnerVendorName { get; set; }
        public int BrokerVendorId { get; set; }
        public string BrokerVendorName { get; set; }
        public int TotalHireAmount { get; set; }
        public int AdvancePayable { get; set; }
        public int LinkId { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
