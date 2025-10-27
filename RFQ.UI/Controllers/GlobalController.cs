using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;
namespace RFQ.UI.Controllers
{
    public class GlobalController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly ICompanyStateService _companyStateService;
        public GlobalController(GlobalClass globalClass, ICompanyStateService companyStateService)
        {
            _globalClass = globalClass;
            _companyStateService = companyStateService;
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

        [HttpGet]
        public async Task<IActionResult> GetAllStateList()
        {
            try
            {
                var stateList = await _companyStateService.GetAllStateList();
                if (stateList != null && stateList.Any())
                    return Json(stateList); // returns 200 with JSON automatically

                return NotFound("No states found.");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
