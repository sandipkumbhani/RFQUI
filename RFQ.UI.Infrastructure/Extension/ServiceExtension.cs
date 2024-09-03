using Microsoft.Extensions.DependencyInjection;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Infrastructure.Extension
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddEfcoreInfrastrucureService(this IServiceCollection services)
        {
            services.AddScoped<ILoginAdaptor, LoginAdaptor>();
            services.AddScoped<IUserAdaptor, UserAdaptor>();
            services.AddScoped<IProfileAdoptor, ProfileAdaptor>();
            return services;
        }
    }
}
