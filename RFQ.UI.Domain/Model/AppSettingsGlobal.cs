using Microsoft.Extensions.Configuration;
using static System.Collections.Specialized.BitVector32;

namespace RFQ.UI.Domain.Model
{
    public class AppSettingsGlobal
    {
        public string? BaseUrl { get; set; }
        public string? PanApiUrl { get; set; }
        public string? GstApiUrl { get; set; }
        public string? VehicleRCApiUrl { get; set; }
        public string? DrivingLicenseAPI { get; set; }
        public string? WhatsAppApiUrl { get; set; }
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
        public string? GetTripDetailsByBillExpiryDate { get; set; }
        public string? AddLocation { get; set; }
        public string? Updatelocation { get; set; }
        public string? GetMasterPartyRoute { get; set; }
        public string? GetMasterPartyVehicleType { get; set; }
        public string? AddMasterUserActivityLog { get; set; }
        public string? GetAllMasterUserActivityLogList { get; set; }
        public string? GetMenu { get; set; }
        public string? AddProduct { get; set; }
        public string? EditProduct { get; set; }
        public string? GetDrpProductList { get; set; }
        public string? AddProfile { get; set; }
        public string? GetProfileAll { get; set; }
        public string? GetAllInternalMaster { get; set; }
        public string? GetAllLinkGroup { get; set; }
        public string? GetLinkItemList { get; set; }
        public string? GetProfileRightsByProfileId { get; set; }
        public string? AddOrUpdateProfileRights { get; set; }
        public string? AddRfqRate { get; set; }
        public string? CheckFinalizationStatusOfRFQ { get; set; }
        public string? GetAllReceivedVendorCosting { get; set; }
        public string? GetAllVehicleIndentList { get; set; }
        public string? GenerateRfqAutoNo { get; set; }
        public string? AddRfq { get; set; }
        public string? GetRfqByRfqNo { get; set; }
        public string? GetRfqById { get; set; }
        public string? GetAllVendorListForRfq { get; set; }
        public string? GetPreviousQuotesList { get; set; }
        public string? GetRfqQuoteRateVendorDetails { get; set; }
        public string? UpdateRfq { get; set; }
        public string? AddRfqFinal { get; set; }
        public string? AwardedVendor { get; set; }
        public string? GetRfqFinalRateList { get; set; }
        public string? UpdateRfqFinal { get; set; }
        public string? GetRfqDrpList { get; set; }
        public string? AddRfqLink { get; set; }
        public string? AddRfqRecipient { get; set; }
        public string? AddUser { get; set; }
        public string? UpdateUser { get; set; }
        public string? GetUserById { get; set; }
        public string? GetAllMasterLocation { get; set; }
        public string? UpdateUserPassword { get; set; }
        public string? GetByLoginIdAsync { get; set; }
        public string? GetAllVehicleCategory { get; set; }
        public string? GetAllOwnerOrVendor { get; set; }
        public string? AddVehicle { get; set; }
        public string? GetAllVehicle { get; set; }
        public string? UpdateVehicle { get; set; }
        public string? GetVehicleNumber { get; set; }
        public string? AddVehicleIndent { get; set; }
        public string? GenerateVehicleIndent { get; set; }
        public string? UpdateVehicleIndent { get; set; }
        public string? AddVehiclePlacement { get; set; }
        public string? GeneratePlacementNo { get; set; }
        public string? AutoFetchPlacement { get; set; }
        public string? UpdateVehiclePlacement { get; set; }
        public string? DeleteVehiclePlacement { get; set; }
        public string? GetAllVehiclePlacementNo { get; set; }
        public string? AddVehicleType { get; set; }
        public string? UpdateVehicleType { get; set; }
        public string? GetAllVehicleTypeList { get; set; }
        public string? UpdateMasterParty { get; set; }
        public string? GetAllVendorList { get; set; }
        public string? GetAllDelivery { get; set; }
        public string? AutoFetchBooking { get; set; }
        public string? UpdateRfqRecipient { get; set; }
        public string? AddBookingOrTrip { get; set; }
        public string? GetLocationById { get; set; }
        public string? IndentReferenceCheckInRfqAsync { get; set; }
        public string? CheckVehicleAndIndentUnique { get; set; }
        public string? GetAutoGenerateCode { get; set; }
        public string? GetAwardedIndentList { get; set; }
        public string? GetVehiclePlacementCountByIndentNo { get; set; }
        public string? CheckAwardedVendor { get; set; }
        public string? GetAwardedVendorListByRfqNo { get; set; }
        public string? GetRfqTableData { get; set; }
        public string? GetMasterPartyById { get; set; }
        public string? GetCards { get; set; }
        public string? GetCardDetails { get; set; }
        public string? GetReportDetails { get; set; }


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
            var usersSection = config.GetSection("Users");
            var productSection = config.GetSection("Product");
            var vehicleIndentSection = config.GetSection("VehicleIndent");
            var rfqFinalizationSection = config.GetSection("RfqFinal");
            var vehiclePlacementSection = config.GetSection("VehiclePlacement");
            var requestForQuoteSection = config.GetSection("RequestForQuote");
            var bookingOrTripSection = config.GetSection("BookingOrTrip");
            var eWayBillSection = config.GetSection("EWayBill");
            var masterPartyRouteSection = config.GetSection("MasterPartyRoute");
            var masterPartyVehicleTypeSection = config.GetSection("MasterPartyVehicleType");
            var masterUserActivityLogSection = config.GetSection("MasterUserActivityLog");
            var menuSection = config.GetSection("Menu");
            var profileSection = config.GetSection("Profile");
            var profileRightSection = config.GetSection("ProfileRight");
            var rfqRateSection = config.GetSection("RFQRate");
            var receivedVendorCostingSection = config.GetSection("ReceivedVendorCosting");
            var rfqRecipientSection = config.GetSection("RfqRecipient");
            var vehicleSection = config.GetSection("Vehicle");
            var deliverySection = config.GetSection("Delivery");
            var commonSection = config.GetSection("Common");
            var dashboardSection = config.GetSection("Dashboard");
            var reportSection = config.GetSection("Report");

            return new AppSettingsGlobal
            {
                BaseUrl = section["BaseUrl"],
                PanApiUrl = section["PanApiUrl"],
                GstApiUrl = section["GstApiUrl"],
                VehicleRCApiUrl = section["VehicleRCApiUrl"],
                DrivingLicenseAPI = section["DrivingLicenseAPI"],
                WhatsAppApiUrl = section["WhatsAppApiUrl"],
                CustomerGetAllCustomer = customerSection["GetAllCustomer"],
                CustomerGetAutoCustomerCode = customerSection["GetAutoCustomerCode"],
                FranchiseGetAllFranchise = franchiseSection["GetAllFranchise"],
                CompanyGetAllCompany = companySection["GetAllCompany"],
                GetAllVehicleType = vehicleTypeSection["GetAllVehicleType"],
                GetAllCompanyConfiguration = companyConfiguration["GetAllCompanyConfiguration"],
                GetAllVendor = vendorSection["GetAllVendor"],
                GetAllVendorList = vendorSection["GetAllVendorList"],
                GetAllLocation = locationSection["GetAllLocation"],
                DriverGetAllDrivers = driverSection["GetAllDriver"],
                GetUserAll = usersSection["GetUserAll"],
                GetAllProduct = productSection["GetAllProduct"],
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
                GetTripDetailsByBillExpiryDate = eWayBillSection["GetTripDetailsByBillExpiryDate"],
                AddLocation = locationSection["AddLocation"],
                Updatelocation = locationSection["Updatelocation"],
                GetMasterPartyRoute = masterPartyRouteSection["GetMasterPartyRoute"],
                GetMasterPartyVehicleType = masterPartyVehicleTypeSection["GetMasterPartyVehicleType"],
                AddMasterUserActivityLog = masterUserActivityLogSection["AddMasterUserActivityLog"],
                GetAllMasterUserActivityLogList = masterUserActivityLogSection["GetAllMasterUserActivityLogList"],
                GetMenu = menuSection["GetMenu"],
                AddProduct = productSection["AddProduct"],
                EditProduct = productSection["EditProduct"],
                GetDrpProductList = productSection["GetDrpProductList"],
                AddProfile = profileSection["AddProfile"],
                GetProfileAll = profileSection["GetProfileAll"],
                GetAllInternalMaster = profileSection["GetAllInternalMaster"],
                GetAllLinkGroup = profileRightSection["GetAllLinkGroup"],
                GetLinkItemList = profileRightSection["GetLinkItemList"],
                GetProfileRightsByProfileId = profileRightSection["GetProfileRightsByProfileId"],
                AddOrUpdateProfileRights = profileRightSection["AddOrUpdateProfileRights"],
                AddRfqRate = rfqRateSection["AddRfqRate"],
                CheckFinalizationStatusOfRFQ = rfqRateSection["CheckFinalizationStatusOfRFQ"],
                GetAllReceivedVendorCosting = receivedVendorCostingSection["GetAllReceivedVendorCosting"],
                GetAllVehicleIndentList = requestForQuoteSection["GetAllVehicleIndentList"],
                GenerateRfqAutoNo = requestForQuoteSection["GenerateRfqAutoNo"],
                AddRfq = requestForQuoteSection["AddRfq"],
                GetRfqByRfqNo = requestForQuoteSection["GetRfqByRfqNo"],
                GetRfqById = requestForQuoteSection["GetRfqById"],
                GetAllVendorListForRfq = requestForQuoteSection["GetAllVendorListForRfq"],
                GetPreviousQuotesList = requestForQuoteSection["GetPreviousQuotesList"],
                GetRfqQuoteRateVendorDetails = requestForQuoteSection["GetRfqQuoteRateVendorDetails"],
                UpdateRfq = requestForQuoteSection["UpdateRfq"],
                AddRfqFinal = rfqFinalizationSection["AddRfqFinal"],
                AwardedVendor = rfqFinalizationSection["AwardedVendor"],
                GetRfqFinalRateList = rfqFinalizationSection["GetRfqFinalRateList"],
                UpdateRfqFinal = rfqFinalizationSection["UpdateRfqFinal"],
                GetRfqDrpList = rfqFinalizationSection["GetRfqDrpList"],
                AddRfqLink = requestForQuoteSection["AddRfqLink"],
                AddRfqRecipient = rfqRecipientSection["AddRfqRecipient"],
                AddUser = usersSection["AddUser"],
                UpdateUser = usersSection["UpdateUser"],
                GetUserById = usersSection["GetUserById"],
                GetAllMasterLocation = usersSection["GetAllMasterLocation"],
                UpdateUserPassword = usersSection["UpdateUserPassword"],
                GetByLoginIdAsync = usersSection["GetByLoginIdAsync"],
                GetAllVehicleCategory = vehicleSection["GetAllVehicleCategory"],
                GetAllOwnerOrVendor = vehicleSection["GetAllOwnerOrVendor"],
                AddVehicle = vehicleSection["AddVehicle"],
                GetAllVehicle = vehicleSection["GetAllVehicle"],
                UpdateVehicle = vehicleSection["UpdateVehicle"],
                GetVehicleNumber = vehicleSection["GetVehicleNumber"],
                AddVehicleIndent = vehicleIndentSection["AddVehicleIndent"],
                GenerateVehicleIndent = vehicleIndentSection["GenerateVehicleIndent"],
                UpdateVehicleIndent = vehicleIndentSection["UpdateVehicleIndent"],
                AddVehiclePlacement = vehiclePlacementSection["AddVehiclePlacement"],
                GeneratePlacementNo = vehiclePlacementSection["GeneratePlacementNo"],
                AutoFetchPlacement = vehiclePlacementSection["AutoFetchPlacement"],
                UpdateVehiclePlacement = vehiclePlacementSection["UpdateVehiclePlacement"],
                DeleteVehiclePlacement = vehiclePlacementSection["DeleteVehiclePlacement"],
                GetAllVehiclePlacementNo = vehiclePlacementSection["GetAllVehiclePlacementNo"],
                AddVehicleType = vehicleTypeSection["AddVehicleType"],
                UpdateVehicleType = vehicleTypeSection["UpdateVehicleType"],
                GetAllVehicleTypeList = vehicleTypeSection["GetAllVehicleTypeList"],
                UpdateMasterParty = customerSection["UpdateMasterParty"],
                GetAllDelivery = deliverySection["GetAllDelivery"],
                AutoFetchBooking = bookingOrTripSection["AutoFetchBooking"],
                UpdateRfqRecipient = rfqRecipientSection["UpdateRfqRecipient"],
                AddBookingOrTrip = bookingOrTripSection["AddBookingOrTrip"],
                GetLocationById = locationSection["GetLocationById"],
                IndentReferenceCheckInRfqAsync = vehicleIndentSection["IndentReferenceCheckInRfqAsync"],
                CheckVehicleAndIndentUnique = vehiclePlacementSection["CheckVehicleAndIndentUnique"],
                GetAutoGenerateCode = commonSection["GetAutoGenerateCode"],
                GetAwardedIndentList = vehiclePlacementSection["GetAwardedIndentList"],
                GetVehiclePlacementCountByIndentNo = vehiclePlacementSection["GetVehiclePlacementCountByIndentNo"],
                CheckAwardedVendor = vehiclePlacementSection["CheckAwardedVendor"],
                GetAwardedVendorListByRfqNo = vehiclePlacementSection["GetAwardedVendorListByRfqNo"],
                GetRfqTableData = requestForQuoteSection["GetRfqTableData"],
                GetMasterPartyById = requestForQuoteSection["GetMasterPartyById"],
                GetCards = dashboardSection["GetCards"],
                GetCardDetails = dashboardSection["GetCardDetails"],
                GetReportDetails = reportSection["GetReportDetails"]
            };
        }
    }
}
