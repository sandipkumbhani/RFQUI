namespace RFQ.UI.Domain.ResponseDto
{
    public class LicenseKycDetailsResponseDto
    {
        public DrivingLicenseModel DrivingLicenseModel { get; set; }
        public int MessageId { get; set; }
        public string? MessageDescription { get; set; }
        public string? Mode { get; set; }
        public string? ServiceProvider { get; set; }
        public string? Value { get; set; }
    }
    public class DrivingLicenseModel
    {
        public string DrivingLicenseNumber { get; set; }

        public string FullName { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string DependentName { get; set; }

        public string PresentAddress { get; set; }

        public string Pincode { get; set; }

        public DateTime ValidityIssueDate { get; set; }

        public DateTime ValidityExpiryDate { get; set; }

        public string RTOState { get; set; }

        public string RTOAuthority { get; set; }

        public string VehicleClassCategory1 { get; set; }

        public string VehicleClassAuthority1 { get; set; }

        public string VehicleClassCategory2 { get; set; }

        public string VehicleClassAuthority2 { get; set; }

        public string VehicleClassCategory3 { get; set; }

        public string VehicleClassAuthority3 { get; set; }

        public string BloodGroup { get; set; }

        public string Photo { get; set; }

        public DateTime LogDateTime { get; set; }
    }
}

