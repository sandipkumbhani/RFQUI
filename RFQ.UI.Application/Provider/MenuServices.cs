using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class MenuServices : IMenuServices
    {
        private readonly IMenuAdaptor _menuAdaptor;
        private readonly IProfileServices _profileServices;

        public MenuServices(IMenuAdaptor menuAdaptor, IProfileServices profileServices)
        {
            _menuAdaptor = menuAdaptor;
            _profileServices = profileServices;
        }
        public async Task<IEnumerable<MenulistModel>> GetMenu(int profileId)
        {
            return await _menuAdaptor.GetMenu(profileId);
        }
        public async Task<IEnumerable<ProfileRightsResponseDto>> GetProfileRightsByProfileId(int profileId)
        {
            return await _profileServices.GetProfileRightsByProfileId(profileId);
        }
    }
}
