namespace RFQ.UI.Domain.Model
{
    public class RfqDto
    {
        public int CompanyId { get; set; }
        public int RfqCategoryId { get; set; }
        public int CustomerId { get; set; }
        public string RfqNoPrefix { get; set; }
        public int RfqNo { get; set; }
        public DateTime RfqDate { get; set; }
        public string RfqSubject { get; set; }
        public DateTime RfqExpiresOn { get; set; }
        public int RfqTypeId { get; set; }
        public DateTime VehicleReqOn { get; set; }
        public int RfqPriorityId { get; set; }
        public string Remarks { get; set; }
        public int LinkId { get; set; }
        public int? StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
