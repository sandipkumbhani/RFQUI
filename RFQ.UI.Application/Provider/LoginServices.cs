using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;
using RFQ.UI.Models;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Application.Provider
{
    public class LoginServices : ILoginServices
    {
        private readonly LoginAdaptor _loginAdaptor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly GlobalClass _globalClass;
        private const string CachePrefix = "LinkItems_Profile_";

        public LoginServices(LoginAdaptor loginAdaptor, IHttpContextAccessor httpContextAccessor, IMemoryCache cache, GlobalClass globalClass)
        {
            _loginAdaptor = loginAdaptor;
            _httpContextAccessor = httpContextAccessor;
            _globalClass = globalClass;
            _cache = cache;
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

            // cache Clear
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
            int profileId = Convert.ToInt32(jwt.Claims.First(c => c.Type == "profileid").Value);
            var cacheKey = $"{CachePrefix}{profileId}";
            _cache.Remove(cacheKey);

            httpContext.SignOutAsync();
            httpContext.Session?.Clear(); //Session Clear

            // Cookies Clear
            if (httpContext.Request.Cookies != null)
            {
                foreach (var key in httpContext.Request.Cookies.Keys)
                {
                    if (key != "rememberMe" && key != "username" && key != "passWord")
                    {
                        httpContext.Response.Cookies.Delete(key);
                    }
                }
            }

            // --- 4. Disable Page Caching (Server + Client) ---
            httpContext.Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0";
            httpContext.Response.Headers["Pragma"] = "no-cache";
            httpContext.Response.Headers["Expires"] = "0";
        }
    }
}
