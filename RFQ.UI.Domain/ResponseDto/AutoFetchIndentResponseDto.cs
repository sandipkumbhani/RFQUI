using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class AutoFetchIndentResponseDto
    {
        public int IndentId { get; set; }
        public string IndentNo { get; set; }
        public DateTime IndentDate { get; set; }
        public int LocationId { get; set; }
        public DateTime VehicleReqOn { get; set; }
        public string RfqNo { get; set; }
        public DateTime RfqDate { get; set; }
        public int PartyId { get; set; }
        public string FromLocation { get; set; }
        public string ToLocation { get; set; }
        public int VehicleTypeId { get; set; }
        public int RequiredVehicles { get; set; }
        public int PendingVehicles { get; set; } = 1;
    }
}
