using RFQ.UI.Application.Inteface;
using RFQ.UI.Infrastructure.Provider;
using RFQ.UI.Models;

namespace RFQ.UI.Application.Provider
{
    public class LoginServices : ILoginServcies
    {
        private readonly LoginAdaptor _loginAdaptor;

        public LoginServices(LoginAdaptor loginAdaptor)
        {
            _loginAdaptor = loginAdaptor;
        }
        public Task<string> Login(LoginViewModel model)
        {
            return _loginAdaptor.PostApiDataAsync(model);
        }
    }
}
