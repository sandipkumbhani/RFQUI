using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IMenuServices
    {
        Task<IEnumerable<MenulistModel>> GetMenu(int profileId);
        Task<IEnumerable<ProfileRightsResponseDto>> GetProfileRightsByProfileId(int profileId);
    }
}
