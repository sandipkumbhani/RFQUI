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
        public string? GetUserAll { get; set; }
        public string? GetAllProduct { get; set; }
        public string? GetAllVehicleIndent { get; set; }
        public string? GetAllRfq { get; set; }
        public string? GetAllVendor { get; set; }
        public string? GetAllLocation { get; set; }
        public string? DriverGetAllDrivers { get; set; }
        public string? GetAllRfqFinalization { get; set; }
        public string? GetAllVehiclePlacement { get; set; }
        public string? GetAllBookingOrTrip { get; set; }
        public string? AddCompanyConfiguration { get; set; }
        public string? UpdateCompanyConfiguration { get; set; }
        public string? DeleteCompanyConfiguration { get; set; }
        public string? AddCompany { get; set; }
        public string? GetAllCompanyAndFranchise { get; set; }
        public string? UpdateCompany { get; set; }
        public string? AddFranchise { get; set; }
        public string? UpdateFranchise { get; set; }
        public string? AddDriver { get; set; }
        public string? UpdateDriver { get; set; }
        public string? GetDriverType { get; set; }
        public string? GetAllDriverList { get; set; }
        public string? GenerateDriverCode { get; set; }

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
            var usersConfiguration = config.GetSection("Users");
            var ProductSection = config.GetSection("Product");
            var vehicleIndentSection = config.GetSection("VehicleIndent");
            var rfqFinalizationSection = config.GetSection("RfqFinal");
            var vehiclePlacementSection = config.GetSection("VehiclePlacement");
            var requestForQuoteSection = config.GetSection("RequestForQuote");
            var bookingOrTripSection = config.GetSection("BookingOrTrip");
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
                DriverGetAllDrivers = driverSection["GetAllDriver"],
                GetUserAll = usersConfiguration["GetUserAll"],
                GetAllProduct = ProductSection["GetAllProduct"],
                GetAllVehicleIndent = vehicleIndentSection["GetAllVehicleIndent"],
                GetAllRfqFinalization = rfqFinalizationSection["GetAllRfqFinal"],
                GetAllVehiclePlacement = vehiclePlacementSection["GetAllVehiclePlacement"],
                GetAllRfq = requestForQuoteSection["GetAllRfq"],
                GetAllBookingOrTrip = bookingOrTripSection["GetAllBookingOrTrip"],
                AddCompanyConfiguration = companyConfiguration["AddCompanyConfiguration"],
                UpdateCompanyConfiguration = companyConfiguration["UpdateCompanyConfiguration"],
                DeleteCompanyConfiguration = companyConfiguration["DeleteCompanyConfiguration"],
                AddCompany = companySection["AddCompany"],
                GetAllCompanyAndFranchise = companySection["GetAllCompanyAndFranchise"],
                UpdateCompany = companySection["UpdateCompany"],
                AddFranchise = franchiseSection["AddFranchise"],
                UpdateFranchise = franchiseSection["UpdateFranchise"],
                AddDriver = driverSection["AddDriver"],
                UpdateDriver = driverSection["UpdateDriver"],
                GetDriverType = driverSection["GetDriverType"],
                GetAllDriverList = driverSection["GetAllDriverList"],
                GenerateDriverCode = driverSection["GenerateDriverCode"],
            };
        }
    }
}
