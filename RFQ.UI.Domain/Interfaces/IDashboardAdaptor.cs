using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IDashboardAdaptor
    {
        Task<IList<DashboardCardResponseDto>?> GetDashboardCards();
        Task<DashboardCardDetailsResponseDto> GetDashboardCardDetails(string cardId);
    }
}
