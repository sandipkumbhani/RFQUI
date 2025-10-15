namespace RFQ.UI.Domain.Helper
{
    public class PageList<T>
    {
        public List<T>? Result { get; set; }
        public string? DisplayColumns { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPage { get; set; }
        public int TotalRecordCount { get; set; }

        public PageList(List<T> items, int count, int pageNumber, int pageSize, string displayColumns = "")
        {
            Result = items;
            TotalRecordCount = count;
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalPage = (int)Math.Ceiling(count / (double)pageSize);
            DisplayColumns = displayColumns;
        }
    }
}
