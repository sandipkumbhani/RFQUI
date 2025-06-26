using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class LocationController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly ILocationService _locationService;
        public LocationController(GlobalClass globalClass, ILocationService locationService)
        {
            _globalClass = globalClass;
            _locationService = locationService;
        }
        public IActionResult Location()
        {
            return View();
        }
        [HttpPost]
        public IActionResult LocationSave([FromBody] LocationRequestDto locationRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                if (locationRequestDto != null)
                {
                    locationRequestDto.CompanyId = Convert.ToInt32(profileid);
                    locationRequestDto.CreatedBy = Convert.ToInt32(profileid);
                    locationRequestDto.UpdatedBy = Convert.ToInt32(profileid);
                    //locationRequestDto.ProfileId = Convert.ToInt32(profileid);


                    var result = _locationService.AddLocation(locationRequestDto);
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
        [HttpGet]
        public async Task<IActionResult> GetAllLocationList()
        {
            try
            {
                var locationlist = await _locationService.GetAllLocationList();

                if (Request.IsAjaxRequest())
                {
                    return Json(locationlist);
                }
                else
                {
                    return Json(locationlist);
                }
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
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;


                locationRequestDto.CreatedBy = Convert.ToInt32(profileid);
                locationRequestDto.UpdatedBy = Convert.ToInt32(profileid);
                locationRequestDto.CompanyId = Convert.ToInt32(profileid);

                var result = await _locationService.EditLocation(locationId, locationRequestDto);
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
        [HttpDelete("Location/Deletelocationlist/{LocationId}")]
        public async Task<IActionResult> Deletelocationlist(int LocationId)
        {
            try
            {
                var result = await _locationService.DeleteLocation(LocationId);
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
    }
}
