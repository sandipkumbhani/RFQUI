using Microsoft.Extensions.DependencyInjection;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;

namespace RFQ.UI.Application.Extension
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services)
        {

            services.AddScoped<IDashboardServices, DashboardServices>();
            services.AddScoped<IProfileServices, ProfileServices>();
            services.AddScoped<IVehicleTypeServices, VehicleTypeServices>();
            services.AddScoped<IMenuServices, MenuServices>();
            services.AddScoped<ICustomerServices, CustomerServices>();
            services.AddScoped<ICorporateCompanyService, CorporateCompanyService>();
            services.AddScoped<IUsersService, UsersService>();
            services.AddScoped<IVehicleService, VehicleService>();
            services.AddScoped<IFranchiseService, FranchiseService>();
            services.AddScoped<ILoginServices, LoginServices>();
            services.AddScoped<ILocationService, LocationService>();
            services.AddScoped<IQuoteRateVendorService, QuoteRateVendorService>();
            services.AddScoped<IVendorService, VendorService>();
            services.AddScoped<ICompanyConfigurationServices, CompanyConfigrationServices>();
            services.AddScoped<IDriverServices, DriverService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IMasterAttachmentService, MasterAttachmentService>();
            services.AddScoped<ICompanyMasterPackingTypeService, CompanyMasterPackingTypeServices>();
            services.AddScoped<ICompanyStateService,CompanyStateService>();
            services.AddScoped<IMasterPartyVehicleTypeService,MasterPartyVehicleTypeService>();
            services.AddScoped<IMasterPartyRouteService, MasterPartyRouteService>();
            services.AddScoped<IVehicleIndentService, VehicleIndentService>();
            services.AddScoped<IRequestForQuoteService, RequestForQuoteService>();
            services.AddScoped<IRfqRecipientService,RfqRecipientService>();
            services.AddScoped<IRfqFinalService,RfqFinalService>();
            services.AddScoped<IVehiclePlacementService, VehiclePlacementService>();
            services.AddScoped<IRfqRateServices, RfqRateServices>();
            services.AddScoped<IRfqLinkService, RfqLinkService>();
            services.AddScoped<IReceivedVendorCostingService, ReceivedVendorCostingService>();
            services.AddScoped<IWhatsAppService, WhatsAppService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IMasterUserActivityLogServices, MasterUserActivityLogServices>();
            services.AddScoped<IBookingOrTripService, BookingOrTripService>();
            services.AddScoped<IEWayBillService, EWayBillService>();
            services.AddScoped<IDeliveryOrCloseTripService, DeliveryOrCloseTripService>();
            services.AddScoped<IBokingInvoiceService, BokingInvoiceService>();
            services.AddScoped<ICommonService, CommonService>();
            return services;
        }
    }
}

