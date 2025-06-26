namespace RFQ.UI.Domain.ResponseDto
{
    public class ComMstVehicleTypeDto
    {
        public int VehicleTypeId { get; set; }
        public int CompanyId { get; set; }
        public string? VehicleTypeName { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }

    }
}
