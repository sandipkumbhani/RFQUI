namespace RFQ.UI.Domain.ResponseDto
{
    public class UserResponseDto
    {
        public int UserId { get; set; }
        public int CompanyId { get; set; }
        public int? LocationId { get; set; }
        public string Company { get; set; }
        public string Location { get; set; }
        public int ProfileId { get; set; }
        public string? PersonName { get; set; }
        public string? LoginId { get; set; }
        public string? Password { get; set; }
        public string? EmailId { get; set; }
        public string? MobileNo { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public string? IsActive { get; set; }


    }
}
