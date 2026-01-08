using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Interface
{
    public interface ICommonService
    {
        Task<string?> GetAutoGenerateCode(AutoGenerateCodeRequestDto requestDto);
    }
}
