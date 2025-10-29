using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class VehicleIndentResponseDto
    {
        public int IndentId { get; set; }
        public string IndentNo { get; set; }
        public int CompanyId { get; set; }
        public int LocationId { get; set; }
        public string? LocationName { get; set; }
        public DateTime IndentDate { get; set; }
        public DateTime VehicleReqOn { get; set; }
        public int PartyId { get; set; }
        public string? PartyName { get; set; }
        public string? FromLocation { get; set; }
        public string? FromLocationState { get; set; }
        public string? FromLocationCity { get; set; }
        public string? FromLatitude { get; set; }
        public string? FromLongitude { get; set; }
        public string? ToLocation { get; set; }
        public string? ToLocationState { get; set; }
        public string? ToLocationCity { get; set; }
        public string? ToLatitude { get; set; }
        public string? ToLongitude { get; set; }
        public int VehicleTypeId { get; set; }
        public string? VehicleTypeName { get; set; }
        public int RequiredVehicles { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int? ConsignerId { get; set; }
        public string? ConsignerName { get; set; }
        public int? ConsigneeId { get; set; }
        public string? ConsigneeName { get; set; }
        public string? PickUpAddress { get; set; }
        public string? DeliveryAddress { get; set; }
        public int ItemId { get; set; }
        public string? ItemName { get; set; }
        public int PackingTypeId { get; set; }
        public string? PakingName { get; set; }
        public string? Remarks { get; set; }
        public int LinkId { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }

    }
}
