using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class RFQFinalizationController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IRfqFinalService _rfqFinalService;
        public RFQFinalizationController(IRfqFinalService rfqFinalService, GlobalClass globalClass)
        {
            _rfqFinalService = rfqFinalService;
            _globalClass = globalClass;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult RFQFinalization()
        {
            return View("Views/RFQ/RFQFinalization.cshtml");
        }
        [HttpPost]
        public async Task<IActionResult> AddRfqFinal([FromBody] RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                if (rfqFinalizationSaveRequestDto != null)
                {
                    rfqFinalizationSaveRequestDto.RfqFinalDto.CreatedBy = Convert.ToInt32(userid);
                    rfqFinalizationSaveRequestDto.RfqFinalDto.UpdatedBy = Convert.ToInt32(userid);
                    var result = await _rfqFinalService.AddRfqFinal(rfqFinalizationSaveRequestDto);
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

        [HttpPut]
        public async Task<IActionResult> UpdateRfqFinal([FromBody]RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                int rfqFinalId = rfqFinalizationSaveRequestDto.RfqFinalDto.RfqFinalIdId;
                if (rfqFinalizationSaveRequestDto != null)
                {
                    rfqFinalizationSaveRequestDto.RfqFinalDto.CreatedBy = Convert.ToInt32(userid);
                    rfqFinalizationSaveRequestDto.RfqFinalDto.UpdatedBy = Convert.ToInt32(userid);
                    var result = await _rfqFinalService.UpdateRfqFinal(rfqFinalId,rfqFinalizationSaveRequestDto);
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

        [HttpGet("RFQFinalization/AwardedVendor/{id}")]
        public async Task<IActionResult> AwardedVendor(int id)
        {
            try
            {
                var routeList = await _rfqFinalService.AwardedVendor(id);
                if (Request.IsAjaxRequest())
                {
                    return Json(routeList);
                }
                else
                {
                    return View(routeList);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetAllRfqFinalization([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _rfqFinalService.GetAllRfqFinalization(pagingParam);
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
        [HttpGet]
        public async Task<IActionResult> GetRfqFinalRateList([FromQuery] int rfqFinalId)
        {
            try
            {
                var result = await _rfqFinalService.GetRfqFinalRateList(rfqFinalId);
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
        [HttpDelete("RFQFinalization/DeleteRfqFinal/{rfqFinalId}")]
        public async Task<IActionResult> DeleteRfqFinal(int rfqFinalId)
        {
            try
            {
                var result = await _rfqFinalService.DeleteRfqFinal(rfqFinalId);
                if (result)
                {
                    return Json(result);
                }
                else
                {
                    return Json(false);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetRfqDrpList([FromQuery]int companyId)
        {
            try
            {
                var result = await _rfqFinalService.GetRfqDrpList(companyId);
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
    }
}