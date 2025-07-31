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
        public async Task<IActionResult> AddRfqFinal([FromBody] RfqFinalRequestDto rfqFinalRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                if (rfqFinalRequestDto != null)
                {
                    rfqFinalRequestDto.CreatedBy = Convert.ToInt32(userid);
                    rfqFinalRequestDto.UpdatedBy = Convert.ToInt32(userid);
                    var result = await _rfqFinalService.AddRfqFinal(rfqFinalRequestDto);
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

        [HttpGet("AwardedVendor/{id}")]
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
    }
}