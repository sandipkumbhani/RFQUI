using RFQ.UI.Application.Interface;
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
        public Task<string> Login(LoginViewModel model)
        {
            return _loginAdaptor.PostApiDataAsync(model);
        }
    }
}
