using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class RFQVendorController : Controller
    {
        public readonly IRFQVendorServices iRFQVendorServices;
        private readonly GlobalClass _globalClass;
        public RFQVendorController(IRFQVendorServices rFQVendorServices, GlobalClass globalClass)
        {
            iRFQVendorServices = rFQVendorServices;
            _globalClass = globalClass;
        }
        public IActionResult Index()
        {
            return View();
        }

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

                    var result = await iRFQVendorServices.AddRfqVendor(requestDto);
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
    }
}
