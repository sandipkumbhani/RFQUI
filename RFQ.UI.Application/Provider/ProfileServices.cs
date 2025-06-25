using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class ProfileServices : IProfileServices
    {
        private readonly ProfileAdaptor _profileAdaptor;

        public ProfileServices(ProfileAdaptor profileAdaptor)
        {
            _profileAdaptor = profileAdaptor;
        }
        public Task<string> AddProfile(ProfileRequestDto profileRequestDto)
        {
            return _profileAdaptor.AddProfile(profileRequestDto);
        }
        public async Task<IEnumerable<ProfileResponseDto>> GetProfileAll()
        {
            return await _profileAdaptor.GetProfileAll();
        }
        public async Task<IEnumerable<InternalMasterResponseDto>> GetAllApplicableList()
        {
            return await _profileAdaptor.GetAllApplicableList();
        }
        public async Task<IEnumerable<LinkGroupResponseDto>> GetAllMenuGroup()
        {
            return await _profileAdaptor.GetAllMenuGroup();
        }
        public async Task<IEnumerable<LinkItemResponseDto>> GetLinkItemList()
        {
            return await _profileAdaptor.GetLinkItemList();
        }
        public async Task<IEnumerable<ProfileRightsResponseDto>> GetProfileRightsByProfileId(int profileId)
        {
            return await _profileAdaptor.GetProfileRightsByProfileId(profileId);
        }
        public async Task<string> AddOrUpdateProfileRights(List<ProfileRightsResponseDto> requestDto)
        {
            return await _profileAdaptor.AddOrUpdateProfileRights(requestDto);
        }
    }
}
