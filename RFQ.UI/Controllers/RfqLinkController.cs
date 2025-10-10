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
        private readonly IMenuServices _menuServices;

        public RfqLinkController(ILogger<RfqLinkController> logger, IRfqLinkService rfqLinkService, GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _logger = logger;
            _rfqLinkService = rfqLinkService;
            _globalClass = globalClass;
            _menuServices = menuServices;
        }

        public async Task<IActionResult> AddRfqLinkData([FromBody] RfqLinkRequestDto rfqLinkRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                if (rfqLinkRequestDto != null)
                {
                    //rfqLinkRequestDto.CompanyId = Convert.ToInt32(companyid);
                    rfqLinkRequestDto.CreatedBy = Convert.ToInt32(userid);
                    //rfqLinkRequestDto.UpdatedBy = Convert.ToInt32(userid);

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
