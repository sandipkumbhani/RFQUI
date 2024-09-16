using RFQ.UI.Domain.Model;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IProfileAdoptor
    {
        Task<string> AddProfile(ProfileViewModelDto profileViewModelDto);

        Task<IEnumerable<ProfileViewModelDto>> GetProfileAll();

        Task<string> EditProfile(int profileId, ProfileViewModelDto profileViewModelDto);

        Task<string> DeleteProfile(int profileId);

    }
}
