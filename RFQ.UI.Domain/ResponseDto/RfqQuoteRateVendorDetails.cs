namespace RFQ.UI.Domain.ResponseDto
{
    public class RfqQuoteRateVendorDetails
    {
        public int RfqId { get; set; }
        public string RfqNo { get; set; }
        public string PANNo { get; set; }
        public int CompanyId { get; set; }
        public int LocationId { get; set; }
        public DateTime RfqDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime VehicleReqOn { get; set; }
        public int PartyId { get; set; }
        public string PartyName { get; set; }
        public int VendorId { get; set; }
        public string FromLocation { get; set; }
        public string ToLocation { get; set; }
        public int VehicleTypeId { get; set; }
        public string VehicleTypeName { get; set; }
        public int VehicleCount { get; set; }
        public int RfqPriorityId { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int PackingTypeId { get; set; }
        public string PackingTypeName { get; set; }
        public string? SpecialInstruction { get; set; }
        public string? WhatsAppNo { get; set; }
    }
}
