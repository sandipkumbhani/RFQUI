using Microsoft.AspNetCore.Mvc;

namespace RFQ.UI.Controllers
{
    public class VehiclePlacementController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IVehiclePlacementService _vehiclePlacementService;
        private readonly ILogger<VehiclePlacementController> _logger;
        public VehiclePlacementController(IVehiclePlacementService vehiclePlacementService, GlobalClass globalClass, ILogger<VehiclePlacementController> logger)
        {
            _globalClass = globalClass;
            _vehiclePlacementService = vehiclePlacementService;
            _logger = logger;
        }
        public IActionResult VehiclePlacement()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetPlacementNo()
        {
            try
            {
                var result = await _vehiclePlacementService.GetPlacementNo();
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddVehiclePlacement([FromBody] VehiclePlacementRequestDto vehiclePlacementRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                if (vehiclePlacementRequestDto != null)
                {
                    vehiclePlacementRequestDto.CreatedBy = Convert.ToInt32(userid);
                    vehiclePlacementRequestDto.UpdatedBy = Convert.ToInt32(userid);

                    var result = await _vehiclePlacementService.AddVehiclePlacement(vehiclePlacementRequestDto);
                    return Json(new { result });
                }
                else
                {
                    return Json(new { result = "fail" });

                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
    }
}
