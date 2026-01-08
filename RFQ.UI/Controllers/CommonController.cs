using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Controllers
{
    public class CommonController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly ICommonService _commonService;
        public CommonController(GlobalClass globalClass, IMenuServices menuServices, ICommonService commonService) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _commonService = commonService;
        }

        public async Task<IActionResult> GetAutoGenerateCode([FromBody]AutoGenerateCodeRequestDto requestDto)
        {
            try
            {
                requestDto.UserId = _globalClass.UserId;
                var result = await _commonService.GetAutoGenerateCode(requestDto);
                return Json(result);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
