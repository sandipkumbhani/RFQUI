using RFQ.UI.Application.Inteface;
using RFQ.UI.Infrastructure.Provider;
using RFQ.UI.Models;

namespace RFQ.UI.Application.Provider
{
    public class LoginServices : ILoginServices
    {
        private readonly LoginAdaptor _loginAdaptor;

        public LoginServices(LoginAdaptor loginAdaptor)
        {
            _loginAdaptor = loginAdaptor;
        }
        public Task<string> Login(LoginViewModel loginViewModel)
        {
            return _loginAdaptor.PostApiDataAsync(loginViewModel);
        }
    }
}
