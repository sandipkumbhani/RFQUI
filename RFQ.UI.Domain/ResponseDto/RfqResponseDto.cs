using System.Net.NetworkInformation;

namespace RFQ.UI.Domain.ResponseDto
{
    public class RfqResponseDto
    {
        public int RfqId { get; set; }
        public string RfqNo { get; set; }
        public int CompanyId { get; set; }
        public int LocationId { get; set; }
        public int IndentId { get; set; }
        public DateTime RfqDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int PartyId { get; set; }
        public DateTime VehicleReqOn { get; set; }
        public string FromLocation { get; set; }
        public string FromLocationState { get; set; }
        public string FromLocationCity { get; set; }
        public string FromLatitude { get; set; }
        public string FromLongitude { get; set; }
        public string ToLocation { get; set; }
        public string ToLocationState { get; set; }
        public string ToLocationCity { get; set; }
        public string ToLatitude { get; set; }
        public string ToLongitude { get; set; }
        public int VehicleTypeId { get; set; }
        public int VehicleCount { get; set; }
        public string RfqSubject { get; set; }
        public int RfqPriorityId { get; set; }
        public int RfqTypeId { get; set; }
        public int ItemId { get; set; }
        public int MaxCosting { get; set; }
        public int DetentionPerDay { get; set; }
        public int DetentionFreeDays { get; set; }
        public int PackingTypeId { get; set; }
        public string? SpecialInstruction { get; set; }
        public int LinkId { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
    }
}
