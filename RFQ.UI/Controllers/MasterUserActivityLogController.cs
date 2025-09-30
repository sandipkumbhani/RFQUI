using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class MasterUserActivityLogController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IMasterUserActivityLogServices _masterUserActivityLogServices;
        private readonly ILogger<MasterUserActivityLogController> _logger;

        public MasterUserActivityLogController(GlobalClass globalClass, IMasterUserActivityLogServices masterUserActivityLogServices, ILogger<MasterUserActivityLogController> logger)
        {
            _globalClass = globalClass;
            _masterUserActivityLogServices = masterUserActivityLogServices;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> AddMasterUserActivityLog([FromBody] MasterUserActivityLogRequestDto RequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                RequestDto.UserId = Convert.ToInt32(userid);
                if (RequestDto != null)
                {
                    var result = await _masterUserActivityLogServices.AddMasterUserActivityLog(RequestDto);
                    return Json(new NewCommonResponseDto
                    {
                        Data = result,
                        Message = "Sucsess",
                        StatusCode = 200

                    });
                }
                else
                    return Json(new NewCommonResponseDto
                    {
                        Data = null,
                        StatusCode = 404
                    });
            }
            catch (Exception ex)
            {
                return Json(new NewCommonResponseDto { Data = "error", Message = ex.Message, StatusCode = 500 });
            }
        }
    }
}
