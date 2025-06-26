namespace RFQ.UI.Domain.ResponseDto
{
    public class NewCommonResponseDto
    {
        public int? StatusCode { get; set; }

        public object Data { get; set; }

        public string? Message { get; set; }

        public string? ErrorMessage { get; set; }
    }
}
