using RFQ.UI.Domain.Model;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IMenuAdaptor
    {
        Task<IEnumerable<MenulistModel>> GetMenu(int profileId);
    }
}
