using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class DashboardServices : IDashboardServices
    {
        private readonly UserAdaptor _dashboardAdaptor;
        private readonly IDashboardAdaptor _dashboardCardAdaptor;
        public DashboardServices(UserAdaptor dashboardAdaptor, IDashboardAdaptor dashboardCardAdaptor)
        {
            _dashboardAdaptor = dashboardAdaptor;
            _dashboardCardAdaptor = dashboardCardAdaptor;
        }

        public Task<IEnumerable<UserResponseDto>> GetAllUsers()
        {
            return _dashboardAdaptor.GetAllUsers();
        }

        public async Task<IList<DashboardCardResponseDto>?> GetDashboardCards()
        {
            return await _dashboardCardAdaptor.GetDashboardCards();
        }

        public async Task<DashboardCardDetailsResponseDto> GetDashboardCardDetails(string cardId)
        {
            return await _dashboardCardAdaptor.GetDashboardCardDetails(cardId);
        }
    }
}
