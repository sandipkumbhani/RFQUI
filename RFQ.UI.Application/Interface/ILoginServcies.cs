using RFQ.UI.Models;

namespace RFQ.UI.Application.Interface
{
    public interface ILoginServcies
    {
        Task<string> Login(LoginViewModel model);
    }
}
