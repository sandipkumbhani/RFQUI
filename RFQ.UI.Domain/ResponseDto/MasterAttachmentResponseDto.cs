namespace RFQ.UI.Domain.ResponseDto
{
    public class MasterAttachmentResponseDto
    {
        public int AttachmentId { get; set; }

        public string? AttachmentName { get; set; }

        public string? AttachmentPath { get; set; }

        public int ReferenceLinkId { get; set; }

        public int AttachmentTypeId { get; set; }

        public int TransactionId { get; set; }
    }
}
