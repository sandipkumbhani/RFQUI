using Microsoft.AspNetCore.Mvc;
using static RFQ.UI.Domain.Model.VehicleTypeViewModel;
using System.IdentityModel.Tokens.Jwt;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Controllers
{
    public class VehicleController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IVehicleTypeServices _vehicleTypeServices;
        private readonly IVehicleService _vehicleServices;

        public VehicleController(IVehicleTypeServices vehicleTypeServices, GlobalClass globalClass, IVehicleService vehicleService)
        {
            _vehicleTypeServices = vehicleTypeServices;
            _globalClass = globalClass;
            _vehicleServices = vehicleService;
        }
        public IActionResult Vehicle()
        {
            return View();
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult VehicleType()
        {
            return View();
        }

        [HttpPost]
        public IActionResult VehicleTypeSave([FromBody] VehicleTypeViewModelDto vehicleTypeViewModelDto)
        {
            if (vehicleTypeViewModelDto != null)
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;


                var Vehicle = new VehicleTypeViewModelDto()
                {
                    CompanyId = Convert.ToInt32(companyid),
                    VehicleTypeName = vehicleTypeViewModelDto.VehicleTypeName,
                    CreatedBy = Convert.ToInt32(profileid),
                    UpdatedBy = Convert.ToInt32(profileid),
                };
                var result = _vehicleTypeServices.AddVehicleType(Vehicle);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });

            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateVehicleType([FromBody] VehicleTypeViewModelDto vehicleTypeViewModelDto)
        {
            try
            {
                int vechicleTypeId = vehicleTypeViewModelDto.VehicleTypeId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                var vehicle = new VehicleTypeViewModelDto
                {
                    VehicleTypeId = vehicleTypeViewModelDto.VehicleTypeId,
                    VehicleTypeName = vehicleTypeViewModelDto.VehicleTypeName,
                    CompanyId = Convert.ToInt32(companyid),
                    CreatedBy = Convert.ToInt32(profileid),
                    UpdatedBy = Convert.ToInt32(profileid)
                };
                var result = await _vehicleTypeServices.EditVehicleType(vechicleTypeId, vehicle);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ViewVehicleType(VehicleTypeViewModel vehicleTypeViewModel)
        {
            try
            {
                vehicleTypeViewModel ??= new VehicleTypeViewModel();
                var userlist = await _vehicleTypeServices.GetVehicleTypeAll();
                if (userlist != null && userlist.Count() > 0)
                {
                    vehicleTypeViewModel.vehicleTypeViewModelDtos.AddRange(userlist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(vehicleTypeViewModel);
                }
                else
                {
                    return View(vehicleTypeViewModel);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpDelete("Vehicle/DeleteVehicleType/{vehicleTypeId}")]
        public async Task<IActionResult> DeleteVehicleType(int vehicleTypeId)
        {
            try
            {
                var result = await _vehicleTypeServices.DeleteVehicleType(vehicleTypeId);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVehicleCategory()
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                int profileID = Convert.ToInt32(profileid);
                var vehicleCategoryList = await _vehicleServices.GetAllVehicleCategory();
                if (vehicleCategoryList != null && vehicleCategoryList.Count() > 0)
                {
                    return Json(vehicleCategoryList);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(vehicleCategoryList);
                }
                else
                {
                    return View(vehicleCategoryList);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetVehicleKycDetails([FromBody]VehicleKycRequestDto requestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                var vehicleCategoryList = await _vehicleServices.GetVehicleKycDetails(requestDto);
                if (vehicleCategoryList == null)
                {
                    return NotFound("No vehicle KYC details found.");
                }
                return Json(vehicleCategoryList);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMasterVehicleType()
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                int profileID = Convert.ToInt32(profileid);
                var vehicleCategoryList = await _vehicleServices.GetAllMasterVehicleType();
                if (vehicleCategoryList != null && vehicleCategoryList.Count() > 0)
                {
                    return Json(vehicleCategoryList);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(vehicleCategoryList);
                }
                else
                {
                    return View(vehicleCategoryList);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
