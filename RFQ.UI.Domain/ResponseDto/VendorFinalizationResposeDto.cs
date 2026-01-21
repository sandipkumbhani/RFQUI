namespace RFQ.UI.Domain.ResponseDto
{
    public class VendorFinalizationResposeDto
    {
        public int VendorId { get; set; }
        public string? PANNo { get; set; }
        public string? VendorName { get; set; }
        public string? VendorRating { get; set; }
        public string? MobNo { get; set; }
        public string? WhatsAppNo { get; set; }
        public string? Email { get; set; }
        public int? VehicleCount { get; set; }
        public int? AvailVehicleCount { get; set; }
        public int? TotalHireCost { get; set; }
        public int? DetentionPerDay { get; set; }
        public int? DetentionFreeDays { get; set; }
        public int? MarginAmount { get; set; }
        public string? VendorPosition { get; set; }
        public bool IsAssigned { get; set; }
        public int AssignedVehicles { get; set; }
    }
}
