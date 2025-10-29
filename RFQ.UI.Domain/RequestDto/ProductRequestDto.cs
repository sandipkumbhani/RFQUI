namespace RFQ.UI.Domain.RequestDto
{
    public class ProductRequestDto
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int? CompanyId { get; set; }
        public string Description { get; set; } = "null";
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
