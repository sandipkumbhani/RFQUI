namespace RFQ.UI.Domain.ResponseDto
{
    public class RfqFinalizationResponseDto
    {
        public int RfqFinalIdId { get; set; }
        public string RfqId { get; set; }
        public string RfqNo { get; set; }
        public int RfqStatusId { get; set; }
        public string RfqStatus { get; set; }
        public int ReasonId { get; set; }
        public string Reason { get; set; }
        public int BillingRate { get; set; }
        public int DetentionPerDay { get; set; }
        public int DetentionFreeDays { get; set; }
        public int MarginAmount { get; set; }
        public string? Remarks { get; set; }
        public int LinkId { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
