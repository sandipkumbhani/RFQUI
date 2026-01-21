using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.RequestDto
{
    public class AssignOrderRequestDto
    {
        public List<VendorFinalizationResposeDto> Vendors { get; set; }
        public string? FromLocation { get; set; }
        public string? ToLocation { get; set; }
        public string? VehicleType { get; set; }
        public DateTime? VehicleReqOn { get; set; }
    }
}
