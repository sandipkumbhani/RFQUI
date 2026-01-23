using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class VehiclePlacementController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IVehiclePlacementService _vehiclePlacementService;
        private readonly ILogger<VehiclePlacementController> _logger;
        public VehiclePlacementController(IVehiclePlacementService vehiclePlacementService, GlobalClass globalClass, ILogger<VehiclePlacementController> logger, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _vehiclePlacementService = vehiclePlacementService;
            _logger = logger;
        }
        public async Task<IActionResult> VehiclePlacement()
        {
            await SetMenuAsync();
            return View();
        }

        public async Task<IActionResult> CreateVehicle()
        {
            //await SetMenuAsync();
            return View("_CreateVehicle");
        }
        
        public async Task<IActionResult> CreateDriver()
        {
            await SetMenuAsync();
            return View("_CreateDriver");
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
                if (vehiclePlacementRequestDto != null)
                {
                    vehiclePlacementRequestDto.CreatedBy = _globalClass.UserId;
                    vehiclePlacementRequestDto.UpdatedBy = _globalClass.UserId;
                    vehiclePlacementRequestDto.CompanyId = _globalClass.CompanyId;
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

        [HttpGet("VehiclePlacement/AutoFetchPlacement/{id}")]
        public async Task<IActionResult> AutoFetchPlacement(int id)
        {
            try
            {
                var routeList = await _vehiclePlacementService.AutoFetchPlacement(id);
                if (Request.IsAjaxRequest())
                    return Json(routeList);
                else
                    return View(routeList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetAllVehiclePlacement([FromBody] PagingParam pagingParam)
        {
            try
            {
                var vehiclePlacementViewModel = new VehiclePlacementResponseDto();
                var result = await _vehiclePlacementService.GetAllVehiclePlacement(pagingParam);
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

        [HttpPut]
        public async Task<IActionResult> UpdateVehiclePlacement([FromBody] VehiclePlacementRequestDto vehiclePlacementRequestDto)
        {
            try
            {
                int placementId = vehiclePlacementRequestDto.PlacementId;
                vehiclePlacementRequestDto.CreatedBy = +_globalClass.UserId;
                vehiclePlacementRequestDto.UpdatedBy = _globalClass.UserId;
                vehiclePlacementRequestDto.CompanyId = _globalClass.CompanyId;
                var result = await _vehiclePlacementService.UpdateVehiclePlacement(placementId, vehiclePlacementRequestDto);
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

        [HttpDelete("VehiclePlacement/DeleteVehiclePlacement/{placementId}")]
        public async Task<IActionResult> DeleteVehiclePlacement(int placementId)
        {
            try
            {
                var result = await _vehiclePlacementService.DeleteVehiclePlacement(placementId);
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
        
        [HttpGet]
        public async Task<IActionResult> GetAllVehiclePlacementNo([FromQuery] int companyId)
        {
            try
            {
                var result = await _vehiclePlacementService.GetAllVehiclePlacementNo(companyId);
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> CheckVehicleAndIndentUnique(int vehicleId, int indentId)
        {
            try
            {
                bool isExists = await _vehiclePlacementService.CheckVehicleAndIndentUnique(vehicleId, indentId);
                return Ok(isExists);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAwardedIndentList(int companyId)
        {
            try
            {
                var result = await _vehiclePlacementService.GetAwardedIndentList(companyId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetVehiclePlacementCountByIndentNo(int indentId)
        {
            try
            {
                var result = await _vehiclePlacementService.GetVehiclePlacementCountByIndentNo(indentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        public async Task<IActionResult> CheckAwardedVendor([FromBody] CheckAwardedVendorRequestDto requestDto)
        {
            try
            {
                var result = await _vehiclePlacementService.CheckAwardedVendor(requestDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

