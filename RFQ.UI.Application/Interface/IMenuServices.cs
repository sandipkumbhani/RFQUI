using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Interface
{
    public interface IMenuServices
    {
        Task<IEnumerable<MenulistDto>> GetMenu(int profileId);
    }
}
