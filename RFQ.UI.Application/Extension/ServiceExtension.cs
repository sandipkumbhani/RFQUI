using Microsoft.Extensions.DependencyInjection;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Extension
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services)
        {
            services.AddScoped<ILoginServices, LoginServices>();
            services.AddScoped<IDashboardServices, DashboardServices>();
            services.AddScoped<IProfileServices, ProfileServices>();
            return services;
        }
    }
}

