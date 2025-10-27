using RFQ.UI.Domain.Interfaces;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Domain.Model
{
    public class GlobalClass
    {
        public string Token { get; set; }
        public int UserId { get; set; }
        public int ProfileId { get; set; }
        public int CompanyId { get; set; }
        

        public JwtSecurityToken jwtToken { get; set; }
        public GlobalClass()
        {
            jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(Token);
            UserId = Convert.ToInt32(jwtToken.Claims.First(c => c.Type == "userid").Value);
            ProfileId = Convert.ToInt32(jwtToken.Claims.First(c => c.Type == "profileid").Value);
            CompanyId = Convert.ToInt32(jwtToken.Claims.First(c => c.Type == "companyid").Value);

        }
    }
}
