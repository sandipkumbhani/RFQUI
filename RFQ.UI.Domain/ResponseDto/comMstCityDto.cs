namespace RFQ.UI.Domain.ResponseDto
{
    public class ComMstCityDto
    {
        public int CityId { get; set; }
        public string Code { get; set; }
        public string CityName { get; set; }
        public int StatusId { get; set; }
        public int StateId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
