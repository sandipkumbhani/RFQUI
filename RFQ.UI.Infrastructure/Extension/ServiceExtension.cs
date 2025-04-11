using Microsoft.Extensions.DependencyInjection;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Infrastructure.Extension
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddEfcoreInfrastrucureService(this IServiceCollection services)
        {

            services.AddScoped<LoginAdaptor>();
            services.AddScoped<UserAdaptor>();
            services.AddScoped<ProfileAdaptor>();
            services.AddScoped<VehicleTypeAdaptor>();
            services.AddScoped<IMenuAdaptor, MenuAdaptor>();
            services.AddScoped<CustomerAdaptor>();
            services.AddScoped<CorporateCompanyAdaptor>();
            services.AddScoped<UsersAdaptor>();
            services.AddScoped<LocationAdaptor>();
            services.AddScoped<IVehicleAdaptor,VehicleAdaptor>(); 
            services.AddScoped<FranchiseAdaptor>();
            services.AddScoped<IVendorAdaptor,VendorAdaptor>();
            services.AddScoped<ICompanyConfigurationAdaptor, CompanyConfigurationAdaptor>();
            services.AddScoped<IProductAdaptor, ProductAdaptor>();
            return services;
        }
    }
}
