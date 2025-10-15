using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;

namespace RFQ.UI.Application.Interface
{
    public interface ILoginServices
    {
        Task<NewCommonResponseDto> Login(LoginDto loginDto);
        void Logout();
    }
}
