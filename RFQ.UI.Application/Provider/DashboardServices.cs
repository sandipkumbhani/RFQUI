using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.ResponseDto;
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

        public Task<IEnumerable<UserResponseDto>> GetAllUsers()
        {
            return _dashboardAdaptor.GetAllUsers();
        }
    }
}
