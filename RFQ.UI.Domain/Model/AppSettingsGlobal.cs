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

        public static AppSettingsGlobal FromConfiguration(IConfiguration config)
        {
            var section = config.GetSection("ApiSettings");
            var customerSection = config.GetSection("Customer");
            return new AppSettingsGlobal
            {
                BaseUrl = section["BaseUrl"],
                PanApiUrl = section["PanApiUrl"],
                GstApiUrl = section["GstApiUrl"],
                VehicleRCApiUrl = section["VehicleRCApiUrl"],
                DrivingLicenseAPI = section["DrivingLicenseAPI"],
                CustomerGetAllCustomer = customerSection["GetAllCustomer"],
                CustomerGetAutoCustomerCode = customerSection["GetAutoCustomerCode"]
            };
        }
    }
}
