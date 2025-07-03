namespace RFQ.UI.Domain.Model
{
    public class RfqDetailDto
    {
        public int RfqId { get; set; }
        public string? FromLoc { get; set; }
        public string? FromLocLat { get; set; }
        public string? FromLocLong { get; set; }
        public string? ToLoc { get; set; }
        public string? ToLocLat { get; set; }
        public string? ToLocLong { get; set; }
        public int RfqOnId { get; set; }
        public int VehicleTypeId { get; set; }
        public int VehicleCount { get; set; }
        public int TotalQty { get; set; }
        public int ItemId { get; set; }
        public int MaxCosting { get; set; }
        public int DetentionPerDay { get; set; }
        public int DetentionFreeDays { get; set; }
        public int PackingTypeId { get; set; }
        public string? SpecialInstruction { get; set; }
    }
}
