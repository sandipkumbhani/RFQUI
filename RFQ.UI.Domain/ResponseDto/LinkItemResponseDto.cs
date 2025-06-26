namespace RFQ.UI.Domain.ResponseDto
{
    public class LinkItemResponseDto
    {
        public int LinkId { get; set; }
        public string LinkName { get; set; }
        public string ListingQuery { get; set; }
        public int LinkGroupId { get; set; }
        public string LinkIcon { get; set; }
        public int SequenceNo { get; set; }
        public string LinkUrl { get; set; }
        public string AddUrl { get; set; }
        public string EditUrl { get; set; }
        public string CancelUrl { get; set; }
        public int StatusId { get; set; }
        public int ProfileId { get; set; }
        public bool? IsAdd { get; set; }
        public bool? IsEdit { get; set; }
        public bool? IsView { get; set; }
        public bool? IsCancel { get; set; }
    }
}
