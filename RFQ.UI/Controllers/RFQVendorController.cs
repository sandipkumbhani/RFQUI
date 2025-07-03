using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class RFQVendorController : Controller
    {
        public readonly IRFQVendorServices _rFQVendorServices;
        private readonly GlobalClass _globalClass;
        public RFQVendorController(IRFQVendorServices rFQVendorServices, GlobalClass globalClass)
        {
            _rFQVendorServices = rFQVendorServices;
            _globalClass = globalClass;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> AddRfqVendor([FromBody] RfqVendorRequestDto requestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;

                if (requestDto != null)
                {
                    requestDto.Rfq.CreatedBy = Convert.ToInt32(companyId);
                    requestDto.Rfq.UpdatedBy = Convert.ToInt32(companyId);
                    requestDto.Rfq.CreatedOn = DateTime.Now;
                    requestDto.Rfq.UpdatedOn = DateTime.Now;

                    var result = await _rFQVendorServices.AddRfqVendor(requestDto);
                    return Json(new { result });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetRfqNo()
        {
            try
            {
                var result = await _rFQVendorServices.GetRfqNo();
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
