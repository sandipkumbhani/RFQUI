using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IDashboardServices
    {
        Task<IEnumerable<UserResponseDto>> GetAllUsers();
    }
}
