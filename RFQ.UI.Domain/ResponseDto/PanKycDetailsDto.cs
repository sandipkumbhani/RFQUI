namespace RFQ.UI.Domain.ResponseDto
{
    public class PanKycDetailModel
    {
        public PanKycDetailsDto PANModel { get; set; }
        public int MessageId { get; set; }
        public string MessageDescription { get; set; }
        public string Mode { get; set; }
        public string ServiceProvider { get; set; }
        public string Value { get; set; }
    }
    public class PanKycDetailsDto
    {
        public string PanNo { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Category { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string PanState { get; set; }
        public int Pincode { get; set; }
        public string Gender { get; set; }
        public bool AadhaarLinked { get; set; }
        public DateTime LogDateTime { get; set; }
        public string Message { get; set; }
    }
}
