namespace RFQ.UI.Domain.ResponseDto
{
    public class ProfileRightsResponseDto
    {
        public int UserProfileRightId { get; set; }
        public int ProfileId { get; set; }
        public int LinkId { get; set; }
        public bool IsAdd { get; set; }
        public bool IsEdit { get; set; }
        public bool IsView { get; set; }
        public bool IsCancel { get; set; }
        public int LinkGroupId { get; set; }
    }
}
