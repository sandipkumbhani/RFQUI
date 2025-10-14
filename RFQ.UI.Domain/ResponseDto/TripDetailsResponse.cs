namespace RFQ.UI.Domain.ResponseDto
{
    public class TripDetailsResponse
    {
        public int? SrNo { get; set; }
        public int? BookingId { get; set; }
        public string? VehicleNo { get; set; }
        public string? BookingNo { get; set; }
        public DateTime? BookingDate { get; set; }
        public string? FromLocation { get; set; }
        public string? ToLocation { get; set; }
    }
}
