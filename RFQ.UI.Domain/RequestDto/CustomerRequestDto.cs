namespace RFQ.UI.Domain.RequestDto
{
    public class CustomerRequestDto
    {
        public int PartyId { get; set; }

        public int? CompanyId { get; set; }

        public int PartyTypeId { get; set; } = 6;

        public string? PartyName { get; set; }

        public string Code { get; set; }

        public int? PartyCategoryId { get; set; } = 0;

        public string? AddressLine { get; set; }

        public int CityId { get; set; }

        public string? PinCode { get; set; }

        public string? ContactPerson { get; set; }

        public string? ContactNo { get; set; }

        public string? MobNo { get; set; }

        public string? WhatsAppNo { get; set; }

        public string? Email { get; set; }

        public string? PANNo { get; set; }

        public string? GSTNo { get; set; }

        public string? LegalName { get; set; }

        public string? TradeName { get; set; }

        public string? TypeOfBusiness { get; set; }

        public string? AadharVerified { get; set; }

        public string? GSTStatus { get; set; }

        public DateTime? GSTVarifiedOn { get; set; }

        public string? PANCardName { get; set; }

        public string? PANStatus { get; set; }

        public string? PANLinkedWithAdhar { get; set; }

        public string? GSTAddress { get; set; }

        public DateTime? PANVerifiedOn { get; set; }

        public int LinkId { get; set; }

        public int StatusId { get; set; }

        public int CreatedBy { get; set; }

        public int UpdatedBy { get; set; }
    }
}
