using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class VehicleIndentController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IVehicleIndentService _vehicleIndentService;
        private readonly ILogger<VehicleIndentController> _logger;
        public VehicleIndentController(GlobalClass globalClass, IVehicleIndentService vehicleIndentService, ILogger<VehicleIndentController> logger)
        {
            _globalClass = globalClass;
            _vehicleIndentService = vehicleIndentService;
            _logger = logger;
        }
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public async Task<IActionResult> AddVehicleIndent([FromBody] VehicleIndentRequestDto vehicleIndentRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;

                if (vehicleIndentRequestDto != null)
                {
                    vehicleIndentRequestDto.CreatedBy = Convert.ToInt32(companyId);
                    vehicleIndentRequestDto.UpdatedBy = Convert.ToInt32(companyId);

                    var result = await _vehicleIndentService.AddVehicleIndent(vehicleIndentRequestDto);
                    return Json(new { result });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetIndentNo()
        {
            try
            {
                var result = await _vehicleIndentService.GetIndentNo();
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }

}
