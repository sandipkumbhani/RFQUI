namespace RFQ.UI.Domain.ResponseDto
{
    public class MasterPartyVehicleTypeResponseDto
    {
        public int PartyVehicleTypeId { get; set; }
        public int PartyId { get; set; }
        public int VehicleTypeId { get; set; }
        public string? VehicleTypeName { get; set; }
    }
}
