using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Inteface
{
    public interface IMenuServices
    {
        Task<IEnumerable<MenulistDto>> GetMenu(int profileId);
    }
}
