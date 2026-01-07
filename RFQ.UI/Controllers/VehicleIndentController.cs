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
    public class VehicleIndentController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IVehicleIndentService _vehicleIndentService;
        private readonly ILogger<VehicleIndentController> _logger;
        public VehicleIndentController(GlobalClass globalClass, IVehicleIndentService vehicleIndentService, ILogger<VehicleIndentController> logger, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _vehicleIndentService = vehicleIndentService;
            _logger = logger;
        }
        public async Task<ActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> AddVehicleIndent([FromBody] VehicleIndentRequestDto vehicleIndentRequestDto)
        {
            try
            {
                if (vehicleIndentRequestDto != null)
                {
                    vehicleIndentRequestDto.CreatedBy = _globalClass.UserId;
                    vehicleIndentRequestDto.UpdatedBy = _globalClass.UserId;
                    vehicleIndentRequestDto.CompanyId = _globalClass.CompanyId;
                    vehicleIndentRequestDto.StatusId = (int)EStatus.IsActive;
                    var result = await _vehicleIndentService.AddVehicleIndent(vehicleIndentRequestDto);
                    return Json(result);
                }
                else
                {
                    return Json(false);
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

        [HttpPost]
        public async Task<IActionResult> GetAllVehicleIndent([FromBody] PagingParam pagingParam)
        {
            try
            {
                var vehicleIndentViewModel = new VehicleIndent();
                var result = await _vehicleIndentService.GetAllVehicleIndent(pagingParam);
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
        public async Task<IActionResult> UpdateVehicleIndent([FromBody] VehicleIndentRequestDto vehicleIndentRequestDto)
        {
            try
            {
                int indentId = vehicleIndentRequestDto.IndentId;
                vehicleIndentRequestDto.CreatedBy = _globalClass.UserId;
                vehicleIndentRequestDto.UpdatedBy = _globalClass.UserId;
                vehicleIndentRequestDto.CompanyId = _globalClass.CompanyId;
                var result = await _vehicleIndentService.UpdateVehicleIndent(indentId, vehicleIndentRequestDto);
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

        [HttpDelete("VehicleIndent/DeleteVehicleIndent/{indentId}")]
        public async Task<IActionResult> DeleteVehicleIndent(int indentId)
        {
            try
            {
                var result = await _vehicleIndentService.DeleteVehicleIndent(indentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        [HttpGet("VehicleIndent/IndentReferenceCheckInRfqAsync/{indentId}")]
        public async Task<IActionResult> IndentReferenceCheckInRfqAsync(int indentId)
        {
            try
            {
                var result = await _vehicleIndentService.IndentReferenceCheckInRfqAsync(indentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

    }
}
