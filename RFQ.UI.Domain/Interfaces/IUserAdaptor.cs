using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IUserAdaptor
    {
        Task<IEnumerable<UserResponseDto>> GetAllUsers();
    }
}
