namespace RFQ.UI.Domain.ResponseDto
{
    public class GstKycDetailsDto
    {
        public GstModelDto GSTModel { get; set; }
        public int MessageId { get; set; }
        public string MessageDescription { get; set; }
        public string Mode { get; set; }
        public string ServiceProvider { get; set; }
        public object Value { get; set; }
    }

    public class GstModelDto
    {
        public string GSTNo { get; set; }
        public string GSTStatus { get; set; }
        public string PanNumber { get; set; }
        public string LegalName { get; set; }
        public string TradeName { get; set; }
        public string CenterJurisdiction { get; set; }
        public string StateJurisdiction { get; set; }
        public string ConstitutionOfBusiness { get; set; }
        public string TaxpayerType { get; set; }
        public bool AadhaarVerified { get; set; }
        public bool FieldVisitConducted { get; set; }
        public DateTime DateOfRegistration { get; set; }
        public string PrincipalAddress { get; set; }
        public DateTime LogDateTime { get; set; }
    }

}
