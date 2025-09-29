using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class MasterUserActivityLogController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IMasterUserActivityLogServices _masterUserActivityLogServices;
        private readonly ILogger <MasterUserActivityLogController> _logger;

        public MasterUserActivityLogController(GlobalClass globalClass, IMasterUserActivityLogServices masterUserActivityLogServices, ILogger<MasterUserActivityLogController> logger)
        {
            _globalClass = globalClass;
            _masterUserActivityLogServices = masterUserActivityLogServices;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> AddMasterUserActivityLog([FromBody] MasterUserActivityLogRequestDto masterUserActivityLogRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                if (masterUserActivityLogRequestDto != null)
                {

                    //masterUserActivityLogRequestDto.CreatedBy = Convert.ToInt32(userid);
                    //masterUserActivityLogRequestDto.UpdatedBy = Convert.ToInt32(userid);
                    //masterUserActivityLogRequestDto.CompanyId = Convert.ToInt32(companyId);
                    var result = await _masterUserActivityLogServices.AddMasterUserActivityLog(masterUserActivityLogRequestDto);
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
