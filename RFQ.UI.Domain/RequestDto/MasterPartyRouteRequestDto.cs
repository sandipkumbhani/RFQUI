namespace RFQ.UI.Domain.RequestDto
{
    public class MasterPartyRouteRequestDto
    {
        public int PartyRouteId { get; set; }
        public int PartyId { get; set; }
        public int FromCityId { get; set; }
        public int FromStateId { get; set; }
        public int ToStateId { get; set; }
    }
}
