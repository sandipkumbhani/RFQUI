using RFQ.UI.Models;

namespace RFQ.UI.Application.Interface
{
    public interface ILoginServices
    {
        Task<string> Login(LoginViewModel loginViewModel);
    }
}
