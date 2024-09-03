using Microsoft.Extensions.DependencyInjection;
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
            return services;
        }
    }
}
