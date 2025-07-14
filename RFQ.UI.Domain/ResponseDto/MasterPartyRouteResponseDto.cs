namespace RFQ.UI.Domain.ResponseDto
{
    public class MasterPartyRouteResponseDto
    {
        public int PartyRouteId { get; set; }
        public int PartyId { get; set; }
        public int FromCityId { get; set; }
        public string? FromCityName { get; set; }
        public int FromStateId { get; set; }
        public string? FromStateName { get; set; }
        public int ToStateId { get; set; }
        public string? ToStateName { get; set; }
    }
}
