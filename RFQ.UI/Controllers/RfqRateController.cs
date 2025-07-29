using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class RfqRateController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IRfqRateServices _rfqRateServices;
        public RfqRateController(IRfqRateServices rfqRateServices, GlobalClass globalClass)
        {
            _rfqRateServices = rfqRateServices;
            _globalClass = globalClass;
        }

        //public IActionResult Index()
        //{
        //    return View();
        //}

        [HttpPost]
        public async Task<IActionResult> AddRfqRate([FromBody] RfqRateRequestDto rfqRateRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                if (rfqRateRequestDto != null)
                {
                    var result = await _rfqRateServices.AddRfqRate(rfqRateRequestDto);
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
    }
}
