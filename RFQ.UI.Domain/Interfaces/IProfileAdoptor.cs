using RFQ.UI.Domain.Model;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IProfileAdoptor
    {
        Task<string> AddProfile(ProfileViewModelDto profileViewModelDto);

        Task<IEnumerable<ProfileViewModelDto>> GetProfileAll();
    }
}
