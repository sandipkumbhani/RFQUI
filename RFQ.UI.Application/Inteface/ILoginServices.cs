using RFQ.UI.Models;

namespace RFQ.UI.Application.Inteface
{
    public interface ILoginServices
    {
        Task<string> Login(LoginViewModel loginViewModel);
    }
}
