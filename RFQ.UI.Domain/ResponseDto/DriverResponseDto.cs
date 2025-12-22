namespace RFQ.UI.Domain.ResponseDto
{
    public class DriverResponseDto
    {
        public int DriverId { get; set; }
        public int? CompanyId { get; set; }
        public int DriverTypeId { get; set; }
        public string DriverName { get; set; }
        public string? DriverCode { get; set; }
        public string? LicenseNo { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? LicenseIssueDate { get; set; }
        public int? LicenseIssueCityId { get; set; }
        public DateTime? LicenseExpDate { get; set; }
        public string? MobNo { get; set; }
        public string? WhatsAppNo { get; set; }
        public string AddressLine { get; set; }
        public int CityId { get; set; }
        public string? PinCode { get; set; }
        public string? DriverImagePath { get; set; }
        public string? DLIssuingRto { get; set; }
        public DateTime? VarifiedOn { get; set; }
        public int? LinkId { get; set; }
        public int? StatusId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? IsActive { get; set; }
    }
}
