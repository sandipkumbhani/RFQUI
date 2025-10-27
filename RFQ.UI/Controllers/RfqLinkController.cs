using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class RfqLinkController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly ILogger<RfqLinkController> _logger;    
        private readonly IRfqLinkService _rfqLinkService;

        public RfqLinkController(ILogger<RfqLinkController> logger, IRfqLinkService rfqLinkService, GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _logger = logger;
            _rfqLinkService = rfqLinkService;
            _globalClass = globalClass;
        }

        public async Task<IActionResult> AddRfqLinkData([FromBody] RfqLinkRequestDto rfqLinkRequestDto)
        {
            try
            {
                
                if (rfqLinkRequestDto != null)
                {
                    //rfqLinkRequestDto.CompanyId = _globalClass.CompanyId;
                    rfqLinkRequestDto.CreatedBy = _globalClass.UserId;
                    //rfqLinkRequestDto.UpdatedBy = _globalClass.userId;

                    //var result = await _requestForQuoteService.AddRfq(rfqLinkRequestDto);
                    //return Json(result);
                    return null;
                }
                else
                {
                    return Json(new { result = "failer" });

                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
    }
}
