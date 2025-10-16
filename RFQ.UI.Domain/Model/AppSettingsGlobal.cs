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
        public string? GetAllVehicleType { get; set; }
        public string? GetAllCompanyConfiguration { get; set; }
        public string? GetUserAll { get; set; }
        public string? GetAllProduct { get; set; }
        public string? GetAllVehicleIndent { get; set; }

        public static AppSettingsGlobal FromConfiguration(IConfiguration config)
        {
            var section = config.GetSection("ApiSettings");
            var customerSection = config.GetSection("Customer");
            var vehicleTypeSection = config.GetSection("VehicleType");
            var companyConfiguration = config.GetSection("CompanyConfiguration");
            var usersConfiguration = config.GetSection("Users");
            var ProductSection = config.GetSection("Product");
            var vehicleIndentSection = config.GetSection("VehicleIndent");
            return new AppSettingsGlobal
            {
                BaseUrl = section["BaseUrl"],
                PanApiUrl = section["PanApiUrl"],
                GstApiUrl = section["GstApiUrl"],
                VehicleRCApiUrl = section["VehicleRCApiUrl"],
                DrivingLicenseAPI = section["DrivingLicenseAPI"],
                CustomerGetAllCustomer = customerSection["GetAllCustomer"],
                GetAllVehicleType = vehicleTypeSection["GetAllVehicleType"],
                GetAllCompanyConfiguration = companyConfiguration["GetAllCompanyConfiguration"],
                GetUserAll = usersConfiguration["GetUserAll"],
                GetAllProduct = ProductSection["GetAllProduct"],
                GetAllVehicleIndent = vehicleIndentSection["GetAllVehicleIndent"]
            };
        }
    }
}
