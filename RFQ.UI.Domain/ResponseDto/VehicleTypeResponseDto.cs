namespace RFQ.UI.Domain.ResponseDto
{
    public class VehicleTypeResponseDto
    {
        public int VehicleTypeId { get; set; }
        public int CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public string? VehicleTypeName { get; set; }
        public int? MinimumKms { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
    }

}
