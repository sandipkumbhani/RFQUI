namespace RFQ.UI.Domain.ResponseDto
{
    public class Data
    {
        public List<object> result { get; set; }
        public string? displayColumns { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public int totalPage { get; set; }
        public int totalRecordCount { get; set; }
    }

    public class CommanResponseDto
    {
        public int StatusCode { get; set; }
        public Data Data { get; set; } = new Data();
        public string? Message { get; set; }
        public string? ErrorMessage { get; set; }
    }

}
