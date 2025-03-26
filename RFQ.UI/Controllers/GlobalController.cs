using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GlobalController : ControllerBase
    {
        private readonly GlobalClass _globalClass;
        public GlobalController(GlobalClass globalClass)
        {
            _globalClass = globalClass;
        }

        [HttpPost("set-token")]
        public IActionResult SetToken([FromBody] string token)
        {
            _globalClass.Token = token;
            return Ok(new { message = "Token set successfully" });
        }

        [HttpGet("get-token")]
        public IActionResult GetToken()
        {
            return Ok(new { token = _globalClass.Token });
        }
    }
}
