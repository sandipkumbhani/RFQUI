namespace RFQ.UI.Domain.RequestDto
{
    public class VehicleKycRequestDto
    {
        public string? VehicleNo { get; set; }
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? ServiceProvider { get; set; }
    }
}
