using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Provider
{
    public class MenuServices : IMenuServices
    {
        private readonly IMenuAdaptor _menuAdaptor;

        public MenuServices(IMenuAdaptor menuAdaptor)
        {
            _menuAdaptor = menuAdaptor;
        }
        public async Task<IEnumerable<MenulistDto>> GetMenu(int profileId)
        {
            return await _menuAdaptor.GetMenu(profileId);
        }
    }
}
