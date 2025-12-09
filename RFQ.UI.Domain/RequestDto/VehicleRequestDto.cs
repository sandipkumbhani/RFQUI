namespace RFQ.UI.Domain.RequestDto
{
    public class VehicleRequestDto
    {
        public int VehicleId { get; set; }
        public int? CompanyId { get; set; }
        public string VehicleNo { get; set; }
        public int VehicleTypeId { get; set; }
        public int? OwnerVendorId { get; set; }
        public int VehicleCategoryId { get; set; }
        public int? VehicleCapacity { get; set; }
        public int? TrackingProviderId { get; set; }
        public string? VehicleStatus { get; set; }
        public string? BlacklistStatus { get; set; }
        public string? RTORegistration { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public string? RegdOwner { get; set; }
        public string? PermanentAddress { get; set; }
        public string? EngineNo { get; set; }
        public string? ChassisNo { get; set; }
        public string? MakeModel { get; set; }
        public DateTime? PUCExpiryDate { get; set; }
        public DateTime? FitnessExpiryDate { get; set; }
        public string? PermitNo { get; set; }
        public DateTime? PermitExpiryDate { get; set; }
        public string? Financer { get; set; }
        public string? OwnerSerialNo { get; set; }
        public string? NPNo { get; set; }
        public DateTime? NPExpiryDate { get; set; }
        public string? InsuranceCo { get; set; }
        public string? PolicyNo { get; set; }
        public DateTime? PolicyExpiryDate { get; set; }
        public DateTime? VerifiedOn { get; set; }
        public decimal? GrossWeight { get; set; }
        public decimal? UnladenWeight { get; set; }
        public DateTime? TaxExpiryDate { get; set; }
        public int LinkId { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
    }
}
