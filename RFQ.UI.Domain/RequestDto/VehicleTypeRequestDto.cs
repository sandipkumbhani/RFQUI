namespace RFQ.UI.Domain.RequestDto
{
    public class VehicleTypeRequestDto
    {
        public int VehicleTypeId { get; set; }
        public int? CompanyId { get; set; }
        public string? VehicleTypeName { get; set; }
        public int? MinimumKms { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
    }
}
