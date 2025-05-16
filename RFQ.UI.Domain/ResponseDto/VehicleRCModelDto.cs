namespace RFQ.UI.Domain.ResponseDto
{
    public class VehicleRCModelDto
    {
        public VehicleRCModel VehicleRCModel { get; set; }
        public int MessageId { get; set; }
        public object MessageDescription { get; set; }
        public string Mode { get; set; }
        public object ServiceProvider { get; set; }
        public object Value { get; set; }
    }
    public class VehicleRCModel
    {
        public string VehicleNo { get; set; }
        public int OwnerSerialNo { get; set; }
        public string OwnerName { get; set; }
        public string OwnerFatherName { get; set; }
        public string PresentAddress { get; set; }
        public string PermanentAddress { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string RegisteredAt { get; set; }
        public string VehicleRCStatus { get; set; }
        public string NormsType { get; set; }
        public string NonUseStatus { get; set; }
        public string PucNumber { get; set; }
        public DateTime PucExpiryDate { get; set; }
        public string InsurancePolicyNumber { get; set; }
        public string InsuranceCompany { get; set; }
        public DateTime InsuranceExpiryDate { get; set; }
        public DateTime VehicleManufacturedDate { get; set; }
        public string VehicleCategory { get; set; }
        public string VehicleCategoryDescription { get; set; }
        public string VehicleChassisNumber { get; set; }
        public string VehicleEngineNumber { get; set; }
        public string VehicleMakerDescription { get; set; }
        public string VehicleMakerModel { get; set; }
        public string VehicleBodyType { get; set; }
        public string VehicleFuelType { get; set; }
        public string VehicleColor { get; set; }
        public float VehicleCubicCapacity { get; set; }
        public int VehicleGrossWeight { get; set; }
        public int VehicleNumberOfCylinders { get; set; }
        public int VehicleSeatingCapacity { get; set; }
        public int VehicleSleeperCapacity { get; set; }
        public int VehicleStandingCapacity { get; set; }
        public int VehicleWheelBase { get; set; }
        public int VehicleUnladenWeight { get; set; }
        public string TaxEndDate { get; set; }
        public string Financier { get; set; }
        public string PermitNumber { get; set; }
        public string PermitExpiryDate { get; set; }
        public string NationalPermitNumber { get; set; }
        public string NationalPermitExpiryDate { get; set; }
        public string NationalPermitIssuedby { get; set; }
        public DateTime LogDateTime { get; set; }
    }

}
