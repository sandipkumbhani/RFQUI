using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IProfileAdoptor
    {
        Task<string> AddProfile(ProfileRequestDto profileRequestDto);
        Task<IEnumerable<ProfileResponseDto>> GetProfileAll();
        Task<IEnumerable<InternalMasterResponseDto>> GetAllApplicableList();


        //Task<string> AddProfileRights(ProfileRightsRequestDto profileRightsRequestDto);
        //Task<IEnumerable<ProfileRightsResponseDto>> GetProfileRightsAll();
        Task<IEnumerable<LinkGroupResponseDto>> GetAllMenuGroup();
        Task<IEnumerable<LinkItemResponseDto>> GetAllLinkItems();
    }
}
