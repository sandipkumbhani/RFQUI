using Microsoft.Extensions.Configuration;

namespace RFQ.UI.Domain.Model
{
    public class AppSettingsGlobal
    {
        public string? BaseUrl { get; set; }
        public string? PanApiUrl { get; set; }
        public string? GstApiUrl { get; set; }
        public string? VehicleRCApiUrl { get; set; }
        public string? DrivingLicenseAPI { get; set; }
        public string? CustomerGetAllCustomer { get; set; }
        public string? CustomerGetAutoCustomerCode { get; set; }
        public string? FranchiseGetAllFranchise { get; set; }
        public string? CompanyGetAllCompany { get; set; }
        public string? GetAllVehicleType { get; set; }
        public string? GetAllCompanyConfiguration { get; set; }
        public string? GetAllVendor { get; set; }
        public string? GetAllLocation { get; set; }
        public string? DriverGetAllDrivers { get; set; }

        public static AppSettingsGlobal FromConfiguration(IConfiguration config)
        {
            var section = config.GetSection("ApiSettings");
            var customerSection = config.GetSection("Customer");
            var franchiseSection = config.GetSection("Franchise");
            var companySection = config.GetSection("CorporateCompany");
            var vehicleTypeSection = config.GetSection("VehicleType");
            var companyConfiguration = config.GetSection("CompanyConfiguration");
            var vendorSection = config.GetSection("Vendor");
            var locationSection = config.GetSection("Location");
            var driverSection = config.GetSection("Driver");
            return new AppSettingsGlobal
            {
                BaseUrl = section["BaseUrl"],
                PanApiUrl = section["PanApiUrl"],
                GstApiUrl = section["GstApiUrl"],
                VehicleRCApiUrl = section["VehicleRCApiUrl"],
                DrivingLicenseAPI = section["DrivingLicenseAPI"],
                CustomerGetAllCustomer = customerSection["GetAllCustomer"],
                CustomerGetAutoCustomerCode = customerSection["GetAutoCustomerCode"],
                FranchiseGetAllFranchise = franchiseSection["GetAllFranchise"],
                CompanyGetAllCompany = companySection["GetAllCompany"],
                GetAllVehicleType = vehicleTypeSection["GetAllVehicleType"],
                GetAllCompanyConfiguration = companyConfiguration["GetAllCompanyConfiguration"],
                GetAllVendor = vendorSection["GetAllVendor"],
                GetAllLocation = locationSection["GetAllLocation"],
                DriverGetAllDrivers = driverSection["GetAllDriver"]
            };
        }
    }
}
