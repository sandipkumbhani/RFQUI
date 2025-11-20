using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class AutoFetchBookingResponseDto
    {
        public int PlacementId { get; set; }
        public string PlacementNo { get; set; }
        public int VehicleId { get; set; }
        public int DriverId { get; set; }
        public string MobileNo { get; set; }
        public int IndentId { get; set; }
        public string IndentNo { get; set; }
        public string FromLocation { get; set; }
        public string ToLocation { get; set; }
        public int PartyId { get; set; }
        public int VehicleTypeId { get; set; }
    }
}
