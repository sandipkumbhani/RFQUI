using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IProfileServices
    {
        Task<string> AddProfile(ProfileRequestDto profileRequestDto);
        Task<IEnumerable<ProfileResponseDto>> GetProfileAll();
        Task<IEnumerable<InternalMasterResponseDto>> GetAllApplicableList();

        //Task<string> AddProfileRights(ProfileRightsRequestDto profileRightsRequestDto);
        //Task<IEnumerable<ProfileRightsResponseDto>> GetProfileRightsAll();
        Task<IEnumerable<LinkGroupResponseDto>> GetAllMenuGroup();
        Task<IEnumerable<LinkItemResponseDto>> GetLinkItemList();

        Task<IEnumerable<ProfileRightsResponseDto>> GetProfileRightsByProfileId(int profileId);
        Task<string> AddOrUpdateProfileRights(List<ProfileRightsResponseDto> requestDto);
    }
}
