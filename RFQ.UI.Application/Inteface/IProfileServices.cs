using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Inteface
{
    public interface IProfileServices
    {
        Task<string> AddProfile(ProfileViewModelDto profileViewModeldto);
        Task<IEnumerable<ProfileViewModelDto>> GetProfileAll();

        Task<string> EditProfile(int profileId, ProfileViewModelDto profileViewModelDto);

        Task<string> DeleteProfile(int profileId);
    }
}
