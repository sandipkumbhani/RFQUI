using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class VendorCostingListResponseDto
    {
        public int RfqId { get; set; }
        public int PartyId { get; set; }
        public string SerialNumber { get; set; }
        public string IndentNumber { get; set; }
        public DateTime? IndentDate { get; set; }
        public string RFQNumber { get; set; }
        public DateTime? RFQDate { get; set; }
        public string CustomerName { get; set; }
        public DateTime? RFQExpiredOn { get; set; }
        public DateTime? VehicleRequiredOn { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string VehicleType { get; set; }
        public int AvailableVehicle { get; set; }
        public string VendorName { get; set; }
        public decimal? TotalHireCost { get; set; }
        public string VendorPosition { get; set; }
        public string ViewQuoteUrl { get; set; }
        public int SpecialInstruction { get; set; }
        public int DetentionPerDay { get; set; }
        public int DetentionFreeDays { get; set; }
        public int VehicleCount { get; set; }
        public string? PackingName { get; set; }
        public string ItemName { get; set; }
        public string PANNo { get; set; }
        public string Email { get; set; }
        public bool AskForReBid { get; set; }
    }
}
