using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class BookingOrTripResponseDto
    {
        public int BookingId { get; set; }
        public string BookingNo { get; set; }
        public int CompanyId { get; set; }
        public int LocationId { get; set; }
        public string? LocationName { get; set; }
        public DateTime BookingDate { get; set; }
        public int PlacementId { get; set; }
        public int EWayBillStateId { get; set; }
        public int BusinessVerticalId { get; set; }
        public string FromLocation { get; set; }
        public string FromLatitude { get; set; }
        public string FromLongitude { get; set; }
        public string ToLocation { get; set; }
        public string ToLatitude { get; set; }
        public string ToLongitude { get; set; }
        public int PartyId { get; set; }
        public string PartyName { get; set; }
        public int VehicleTypeId { get; set; }
        public string VehicleTypeName { get; set; }
        public string VehicleNo { get; set; }
        public int DriverId { get; set; }
        public string DriverName { get; set; }
        public string DriverMobNo { get; set; }
        public int InternalMasterId { get; set; }
        public string InternalMasterName { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int InvoiceValue { get; set; }
        public string EWayBillNo { get; set; }
        public DateTime EWayBillDate { get; set; }
        public DateTime EWayBillExpiryDate { get; set; }
        public int ConsignerId { get; set; }
        public string ConsignerName { get; set; }
        public int ConsigneeId { get; set; }
        public string ConsigneeName { get; set; }
        public int TransitDays { get; set; }
        public DateTime EDD { get; set; }
        public int ItemId { get; set; }
        public int PackingTypeId { get; set; }
        public int TotalPacket { get; set; }
        public int ActualWeight { get; set; }
        public int ChargedWeight { get; set; }
        public int TotalFreight { get; set; }
        public int LinkId { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }

    }
}
