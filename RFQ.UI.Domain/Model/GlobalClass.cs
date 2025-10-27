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
    }
}
