using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Model;
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

        public Task<string> AddProfile(ProfileViewModelDto profileViewModelDto)
        {
            return _profileAdaptor.AddProfile(profileViewModelDto);
        }

        public Task<string> DeleteProfile(int profileId)
        {
            return _profileAdaptor.DeleteProfile(profileId);
        }

        public Task<string> EditProfile(int profileId, ProfileViewModelDto profileViewModelDto)
        {
            return _profileAdaptor.EditProfile(profileId, profileViewModelDto);
        }

        public async Task<IEnumerable<ProfileViewModelDto>> GetProfileAll()
        {
            return await _profileAdaptor.GetProfileAll();
        }
    }
}
