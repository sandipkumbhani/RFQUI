using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;
using RFQ.UI.Models;

namespace RFQ.UI.Application.Provider
{
    public class LoginServices : ILoginServices
    {
        private readonly LoginAdaptor _loginAdaptor;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoginServices(LoginAdaptor loginAdaptor, IHttpContextAccessor httpContextAccessor)
        {
            _loginAdaptor = loginAdaptor;
            _httpContextAccessor = httpContextAccessor;
        }

        public Task<NewCommonResponseDto> Login(LoginDto loginDto)
        {
            return _loginAdaptor.PostApiDataAsync(loginDto);
        }

        public void Logout()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
                return;

            httpContext.SignOutAsync();
            httpContext.Session?.Clear();
            if (httpContext.Request.Cookies != null)
            {
                foreach (var key in httpContext.Request.Cookies.Keys)
                {
                    httpContext.Response.Cookies.Delete(key);
                }
            }

            // --- 4. Disable Page Caching (Server + Client) ---
            httpContext.Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0";
            httpContext.Response.Headers["Pragma"] = "no-cache";
            httpContext.Response.Headers["Expires"] = "0";
        }
    }
}
