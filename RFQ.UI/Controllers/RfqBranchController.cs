using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class RfqBranchController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IRfqBranchService _rfqService;

        public RfqBranchController(IRfqBranchService rfqService, GlobalClass globalClass)
        {
            _rfqService = rfqService;
            _globalClass = globalClass;
        }
        public IActionResult BranchRequest()
        {
            return View();
        }

        
        public async Task<IActionResult> AddRfqBranch([FromBody] RfqBranchRequestDto rfqRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                //rfqRequestDto.LogoImage = "null";
                if (rfqRequestDto != null)
                {
                    rfqRequestDto.Rfq.CreatedBy = Convert.ToInt32(profileid);
                    rfqRequestDto.Rfq.UpdatedBy = Convert.ToInt32(profileid);
                    rfqRequestDto.Rfq.CreatedOn = DateTime.Now;
                    rfqRequestDto.Rfq.UpdatedOn = DateTime.Now;


                    var result = await _rfqService.AddRfqBranch(rfqRequestDto);
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
