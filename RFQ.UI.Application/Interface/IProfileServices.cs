using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IProfileServices
    {
        Task<string> AddProfile(ProfileRequestDto profileRequestDto);
        Task<IEnumerable<ProfileResponseDto>> GetProfileAll();
        Task<IEnumerable<InternalMasterResponseDto>> GetAllApplicableList();
    }
}
