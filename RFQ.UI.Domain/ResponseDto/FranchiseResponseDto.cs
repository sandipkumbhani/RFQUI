namespace RFQ.UI.Domain.ResponseDto
{
    public class FranchiseResponseDto
    {
        public int CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public int CompanyTypeId { get; set; }
        public string? AddressLine { get; set; }
        public int CityId { get; set; }
        public string? PinCode { get; set; }
        public string? ContactPerson { get; set; }
        public string? ContactNo { get; set; }
        public string? MobNo { get; set; }
        public string? WhatsAppNo { get; set; }
        public string? Email { get; set; }
        public string? PANNo { get; set; }
        public string? GSTNo { get; set; }
        public string? LogoImage { get; set; }
        public int ParentCompanyId { get; set; }
        public int LinkId { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string? IsActive { get; set; }
    }
}
