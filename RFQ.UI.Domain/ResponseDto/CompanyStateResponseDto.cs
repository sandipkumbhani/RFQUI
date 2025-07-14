namespace RFQ.UI.Domain.ResponseDto
{
    public class CompanyStateResponseDto
    {
        public int StateId { get; set; }
        public string? Code { get; set; }
        public string? StateName { get; set; }
        public int CountryId { get; set; }
        public string? NsdlCode { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
