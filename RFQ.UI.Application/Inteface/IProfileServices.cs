using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Inteface
{
    public interface IProfileServices
    {
        Task<string> AddProfile(ProfileViewModelDto profileViewModeldto);
        Task<IEnumerable<ProfileViewModelDto>> GetProfileAll();
    }
}
