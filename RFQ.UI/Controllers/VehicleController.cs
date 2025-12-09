using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;


namespace RFQ.UI.Controllers
{
    public class VehicleController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IVehicleTypeServices _vehicleTypeServices;
        private readonly IVehicleService _vehicleServices;

        public VehicleController(IVehicleTypeServices vehicleTypeServices, GlobalClass globalClass, IVehicleService vehicleService, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _vehicleTypeServices = vehicleTypeServices;
            _globalClass = globalClass;
            _vehicleServices = vehicleService;
        }
        public async Task<IActionResult> Vehicle()
        {
            await SetMenuAsync();
            return View();
        }
        public async Task<IActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }

        public async Task<IActionResult> VehicleType()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> VehicleTypeSave([FromBody] VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            try
            {
                if (vehicleTypeRequestDto != null)
                {
                    vehicleTypeRequestDto.CompanyId = _globalClass.CompanyId;
                    vehicleTypeRequestDto.CreatedBy = _globalClass.UserId;
                    vehicleTypeRequestDto.UpdatedBy = _globalClass.UserId;
                    vehicleTypeRequestDto.StatusId = (int)EStatus.IsActive;
                    var result = await _vehicleTypeServices.AddVehicleType(vehicleTypeRequestDto);
                    return Json(result);
                }
                return null;
            }
            catch (Exception ex)
            {
                return Json(new NewCommonResponseDto { Data = null, Message = ex.Message.ToString() });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateVehicleType([FromBody] VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            try
            {
                int vechicleTypeId = vehicleTypeRequestDto.VehicleTypeId;
                vehicleTypeRequestDto.CompanyId = _globalClass.CompanyId;
                vehicleTypeRequestDto.CreatedBy = _globalClass.UserId;
                vehicleTypeRequestDto.UpdatedBy = _globalClass.UserId;

                var result = await _vehicleTypeServices.UpdateVehicleType(vechicleTypeId, vehicleTypeRequestDto);
                return Json(result);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        public async Task<IActionResult> ViewVehicleType([FromBody] PagingParam pagingParam)
        {
            try
            {
                var vehicleTypeViewModel = new VehicleTypeResponseDto();
                var result = await _vehicleTypeServices.GetVehicleTypeAll(pagingParam);
                if (Request.IsAjaxRequest())
                {
                    return Json(new
                    {
                        draw = result.PageNumber,
                        recordsTotal = result.TotalRecordCount,
                        recordsFiltered = result.TotalRecordCount,
                        displayColumn = result.DisplayColumns,
                        data = result.Result
                    });
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
                    return Json(new { result = "success" });
                else
                    return Json(new { result = "failure" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ViewVehicle([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _vehicleServices.GetAllVehicle(pagingParam);
                if (Request.IsAjaxRequest())
                {
                    return Json(new
                    {
                        draw = result.PageNumber,
                        recordsTotal = result.TotalRecordCount,
                        recordsFiltered = result.TotalRecordCount,
                        displayColumn = result.DisplayColumns,
                        data = result.Result
                    });
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

        [HttpPost]
        public async Task<IActionResult> VehicleSave([FromBody] VehicleRequestDto vehicleRequestDto)
        {
            try
            {
                if (vehicleRequestDto != null)
                {
                    vehicleRequestDto.CreatedBy = _globalClass.UserId;
                    vehicleRequestDto.UpdatedBy = _globalClass.UserId;
                    vehicleRequestDto.CompanyId = _globalClass.CompanyId;
                    vehicleRequestDto.StatusId = (int)EStatus.IsActive;
                    var result = await _vehicleServices.AddVehicle(vehicleRequestDto);
                    if (!String.IsNullOrEmpty(result))
                    {
                        return Json(result);
                    }
                }
                return Json(new { result = "failure" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateVehicle([FromBody] VehicleRequestDto vehicleRequestDto)
        {
            try
            {
                int vehicleId = vehicleRequestDto.VehicleId;
                vehicleRequestDto.CreatedBy = _globalClass.UserId;
                vehicleRequestDto.UpdatedBy = _globalClass.UserId;
                vehicleRequestDto.CompanyId = _globalClass.CompanyId;

                var result = await _vehicleServices.EditVehicle(vehicleId, vehicleRequestDto);
                if (!String.IsNullOrEmpty(result))
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
                if (!String.IsNullOrEmpty(result))
                    return Json(new { result = "success" });
                else
                    return Json(new { result = "failure" });
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
                var vehicleCategoryList = await _vehicleServices.GetAllVehicleCategory();
                if (vehicleCategoryList != null && vehicleCategoryList.Count() > 0)
                    return Json(vehicleCategoryList);
                if (Request.IsAjaxRequest())
                    return Json(vehicleCategoryList);
                else
                    return View(vehicleCategoryList);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetVehicleKycDetails([FromBody] VehicleKycRequestDto vehicleKycRequestDto)
        {
            try
            {
                var vehicleCategoryList = await _vehicleServices.GetVehicleKycDetails(vehicleKycRequestDto);
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
        public async Task<IActionResult> GetAllMasterVehicleType([FromQuery] int companyId)
        {
            try
            {
                var vehicleCategoryList = await _vehicleServices.GetAllMasterVehicleType(companyId);
                if (vehicleCategoryList != null && vehicleCategoryList.Count() > 0)
                    return Json(vehicleCategoryList);
                else
                    return Json(vehicleCategoryList);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOwnerOrVendor([FromQuery] int companyId)
        {
            try
            {
                var OwnerOrVendorList = await _vehicleServices.GetAllOwnerOrVendor(companyId);
                if (OwnerOrVendorList != null && OwnerOrVendorList.Count() > 0)
                    return Json(OwnerOrVendorList);
                if (Request.IsAjaxRequest())
                    return Json(OwnerOrVendorList);
                else
                    return View(OwnerOrVendorList);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVehicleTypes()
        {
            try
            {
                var vehicleTypeList = await _vehicleTypeServices.GetAllVehicleTypes();
                if (vehicleTypeList != null && vehicleTypeList.Count() > 0)
                    return Json(vehicleTypeList);
                if (Request.IsAjaxRequest())
                    return Json(vehicleTypeList);
                else
                    return View(vehicleTypeList);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetVehicleNumber()
        {
            try
            {
                var vehicleNumberList = await _vehicleServices.GetVehicleNumber();
                if (vehicleNumberList != null && vehicleNumberList.Count() > 0)
                    return Json(vehicleNumberList);
                if (Request.IsAjaxRequest())
                    return Json(vehicleNumberList);
                else
                    return View(vehicleNumberList);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}