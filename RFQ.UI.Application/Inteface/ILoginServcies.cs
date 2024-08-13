using RFQ.UI.Models;

namespace RFQ.UI.Application.Inteface
{
    public interface ILoginServcies
    {
        Task<string> Login(LoginViewModel model);
    }
}
