using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class LocationController : BaseController
    {
        private readonly ILocationService _locationService;
        private readonly GlobalClass _globalClass;

        public LocationController(GlobalClass globalClass, ILocationService locationService, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _locationService = locationService;
        }

        public async Task<IActionResult> Location()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> LocationSave([FromBody] LocationRequestDto locationRequestDto)
        {
            try
            {
                if (locationRequestDto != null)
                {
                    locationRequestDto.CompanyId = _globalClass.CompanyId;
                    locationRequestDto.CreatedBy = _globalClass.UserId;
                    locationRequestDto.UpdatedBy = _globalClass.UserId;
                    locationRequestDto.StatusId = (int)EStatus.IsActive;
                    var result = await _locationService.AddLocation(locationRequestDto);
                    return Json(result);
                }
                else
                {
                    return Json(false);
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("409"))
                    return Conflict("Location name already exists");
                else
                    throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLocationList([FromQuery] int companyId)
        {
            try
            {
                var locationlist = await _locationService.GetAllLocationList(companyId);
                if (Request.IsAjaxRequest())
                    return Json(locationlist);
                else
                    return Json(locationlist);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> ViewLocationList([FromBody] PagingParam pagingParam)
        {
            try
            {
                var locationViewModel = new LocationResponseDto();
                var result = await _locationService.GetAllLocation(pagingParam);
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
        public async Task<IActionResult> EditLocationList([FromBody] LocationRequestDto locationRequestDto)
        {
            try
            {
                int locationId = locationRequestDto.LocationId;
                locationRequestDto.CreatedBy = _globalClass.UserId;
                locationRequestDto.UpdatedBy = _globalClass.UserId;
                locationRequestDto.CompanyId = _globalClass.CompanyId;
                var result = await _locationService.EditLocation(locationId, locationRequestDto);
                return Json(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("409"))
                    return Conflict("Location name already exists");
                else
                    throw;
            }
        }

        [HttpDelete("Location/Deletelocationlist/{LocationId}")]
        public async Task<IActionResult> Deletelocationlist(int LocationId)
        {
            try
            {
                var result = await _locationService.DeleteLocation(LocationId);
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


        public async Task<IActionResult> GetLocationById(int id)
        {
            try
            {
                var result = await _locationService.GetLocationById(id);
                if (result != null)
                    return Json(result);
                else
                    return Json(null);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
