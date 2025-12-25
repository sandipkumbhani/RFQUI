using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;

namespace RFQ.UI.Controllers
{
    public class MasterUserActivityLogController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IMasterUserActivityLogServices _masterUserActivityLogServices;
        private readonly ILogger<MasterUserActivityLogController> _logger;

        public MasterUserActivityLogController(GlobalClass globalClass, IMasterUserActivityLogServices masterUserActivityLogServices, ILogger<MasterUserActivityLogController> logger, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _masterUserActivityLogServices = masterUserActivityLogServices;
            _logger = logger;
        }

        public async Task<IActionResult> MasterUserActivityLog()
        {
            await SetMenuAsync();
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> AddMasterUserActivityLog([FromBody] MasterUserActivityLogRequestDto RequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                RequestDto.LogDateTime = DateTime.Now;
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

        [HttpPost]
        public async Task<IActionResult> GetAllMasterUserActivityLogList([FromBody] PagingParam pagingParam)
        {
            try
            {
                var masterUserActivityLogViewModel = new MasterUserActivityLogResponseDto();
                var result = await _masterUserActivityLogServices.GetAllMasterUserActivityLogList(pagingParam);
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
    }
}
