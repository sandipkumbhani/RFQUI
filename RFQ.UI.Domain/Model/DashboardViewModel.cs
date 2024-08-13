namespace RFQ.UI.Domain.Model
{
    public class DashboardViewModel
    {
        public DashboardViewModel()
        {
            CompanyUserDto = new List<CompanyUserDto>();
        }
        public List<CompanyUserDto> CompanyUserDto { get; set; }
    }

    public class CompanyUserDto
    {
        public int UserId { get; set; }
        public int CompanyId { get; set; }
        public int LocationId { get; set; }
        public int ProfileId { get; set; }
        public string PersonName { get; set; }
        public string? LoginId { get; set; }
        public string? Password { get; set; }
        public string EmailId { get; set; }
        public string? MobileNo { get; set; }
        public int StatusId { get; set; } = 1;
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
