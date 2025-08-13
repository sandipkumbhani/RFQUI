using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class ReceivedVendorCostingController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IReceivedVendorCostingService _receivedVendorCostingService;
        public ReceivedVendorCostingController(GlobalClass globalClass, IReceivedVendorCostingService receivedVendorCostingService)
        {
            _globalClass = globalClass;
            _receivedVendorCostingService = receivedVendorCostingService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetAllReceivedVendorCosting()
        {
            try
            {
                ReceivedVendorCosting request = new();
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                request.CompanyId = Convert.ToInt32(companyId);
                var result = await _receivedVendorCostingService.GetAllReceivedVendorCosting(request);
                if (result == null || !result.Any())
                    return Json(new { success = false, message = "No data found." });
                else
                    return Json(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
