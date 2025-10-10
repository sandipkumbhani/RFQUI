namespace RFQ.UI.Domain.Model
{
    public class MenulistModel
    {
        public int LinkId { get; set; }
        public string? LinkName { get; set; }
        public string? ListingQuery { get; set; }
        public string? GroupId { get; set; }
        public string? LinkIcon { get; set; }
        public string? SequenceNo { get; set; }

        public string? GroupSequenceNo { get; set; }
        public string? LinkUrl { get; set; }
        public string? AddUrl { get; set; }
        public string? EditUrl { get; set; }
        public string? CancelUrl { get; set; }
        public int StatusId { get; set; }
        public int LinkGroupId { get; set; }
        public string? LinkGroupName { get; set; }
        public string? LinkGroupIcon { get; set; }
    }
}
