using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ILoginAdaptor
    {
        Task<NewCommonResponseDto> PostApiDataAsync(LoginDto loginDto);
    }
}
