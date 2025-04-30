using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Application.Provider;

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
        public IActionResult VehicleTypeSave([FromBody] VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            try
            {
                if (vehicleTypeRequestDto != null)
                {
                    var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                    string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                    string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                    vehicleTypeRequestDto.CompanyId = Convert.ToInt32(companyid);
                    vehicleTypeRequestDto.CreatedBy = Convert.ToInt32(profileid);
                    vehicleTypeRequestDto.UpdatedBy = Convert.ToInt32(profileid);

                    var result = _vehicleTypeServices.AddVehicleType(vehicleTypeRequestDto);
                    return Json(new { result = "success" });
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

        [HttpPut]
        public async Task<IActionResult> UpdateVehicleType([FromBody] VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            try
            {
                int vechicleTypeId = vehicleTypeRequestDto.VehicleTypeId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                vehicleTypeRequestDto.CompanyId = Convert.ToInt32(companyid);
                vehicleTypeRequestDto.CreatedBy = Convert.ToInt32(profileid);
                vehicleTypeRequestDto.UpdatedBy = Convert.ToInt32(profileid);

                var result = await _vehicleTypeServices.UpdateVehicleType(vechicleTypeId, vehicleTypeRequestDto);
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
        public async Task<IActionResult> ViewVehicleType()
        {
            try
            {
                var vehicleTypeViewModel = new VehicleTypeResponseDto();
                var result = await _vehicleTypeServices.GetVehicleTypeAll();
                if (Request.IsAjaxRequest())
                {
                    return Json(result);
                }
                else
                {
                    return View(result);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
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
        public async Task<IActionResult> ViewVehicle()
        {
            try
            {
                var VehicleList = await _vehicleServices.GetAllVehicle();

                if (Request.IsAjaxRequest())
                {
                    return Json(VehicleList);
                }
                else
                {
                    return View(VehicleList);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> VehicleSave([FromBody] VehicleRequestDto vehicleRequestDto)
        {
            try
            {
                if (!ModelState.IsValid) 
                {
                    return BadRequest(ModelState);
                }

                if (vehicleRequestDto != null)
                {
                    var result = await _vehicleServices.AddVehicle(vehicleRequestDto);
                    return Json(new { result });
                }
                else
                {
                    return Json(new { result = "fail" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}"); 
                throw new Exception(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateVehicle([FromBody] VehicleRequestDto vehicleRequestDto)
        {   
            //try
            //{
            //    if (vehicleRequestDto.VehicleId <= 0)
            //    {
            //        return Json(new { result = "error", message = "Invalid VehicleId." });
            //    }
            //    int vehicleId = vehicleRequestDto.VehicleId;
            //    var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
            //    string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
            //    vehicleRequestDto.CreatedBy = Convert.ToInt32(profileId);
            //    vehicleRequestDto.UpdatedBy = Convert.ToInt32(profileId);
            //    var result = await _vehicleServices.EditVehicle(vehicleId, vehicleRequestDto);
            //    if (result != null)
            //    {
            //        return Json(new { result = "success" });
            //    }
            //    else
            //    {
            //        return Json(new { result = "failure" });
            //    }
            //}
            //catch (Exception ex)
            //{
            //    return Json(new { result = "error", message = ex.Message });
            //}
            try
            {
                var result = await _vehicleServices.EditVehicle(vehicleRequestDto);
                if (result != null)
                    return Json(new { result = "success" });
                else
                    return Json(new { result = "failure" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpDelete("Vehicle/DeleteVehicle/{vehicleId}")]
        public async Task<IActionResult> DeleteVehicle(int vehicleId)
        {
            try
            {
                var result = await _vehicleServices.DeleteVehicle(vehicleId);
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
        public async Task<IActionResult> GetVehicleKycDetails([FromBody] VehicleKycRequestDto requestDto)
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

        [HttpGet]
        public async Task<IActionResult> GetAllOwnerOrVendor()
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                int profileID = Convert.ToInt32(profileid);
                var OwnerOrVendorList = await _vehicleServices.GetAllOwnerOrVendor();
                if (OwnerOrVendorList != null && OwnerOrVendorList.Count() > 0)
                {
                    return Json(OwnerOrVendorList);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(OwnerOrVendorList);
                }
                else
                {
                    return View(OwnerOrVendorList);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
