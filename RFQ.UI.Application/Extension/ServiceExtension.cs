using Microsoft.Extensions.DependencyInjection;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Application.Provider;

namespace RFQ.UI.Application.Extension
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services)
        {
            services.AddScoped<ILoginServcies, LoginServices>();
            services.AddScoped<IDashboardServices, DashboardServices>();
            return services;
        }
    }
}

