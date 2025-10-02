namespace RFQ.UI.Domain.RequestDto
{
    public class PagingParam
    {
        public int? ProfileId { get; set; }
        public int? CompanyId { get; set; }
        public int Draw { get; set; }
        public int Start { get; set; }
        public int Length { get; set; }
        public string SearchValue { get; set; }
        public string OrderColumn { get; set; }
        public string OrderDir { get; set; }
        public int UserId { get; set; }
    }
}
