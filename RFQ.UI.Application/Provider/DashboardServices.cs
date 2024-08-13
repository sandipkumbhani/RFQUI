using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class DashboardServices : IDashboardServices
    {
        private readonly UserAdaptor _dashboardAdaptor;

        public DashboardServices(UserAdaptor dashboardAdaptor)
        {
            _dashboardAdaptor = dashboardAdaptor;
        }

        public Task<IEnumerable<CompanyUserDto>> GetAllUsers()
        {
            return _dashboardAdaptor.GetAllUsers();
        }
    }
}
