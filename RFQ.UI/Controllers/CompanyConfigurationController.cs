using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class CompanyConfigurationController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly ICompanyConfigurationServices _companyConfigurationServices;
        public CompanyConfigurationController(GlobalClass globalClass, ICompanyConfigurationServices companyConfigrationServices)
        {
            _globalClass = globalClass;
            _companyConfigurationServices = companyConfigrationServices;
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCompanyConfigration()
        {
            try
            {
                var customerList = await _companyConfigurationServices.GetAllCompanyConfiguration();
                if (Request.IsAjaxRequest())
                    return Json(customerList);
                else
                    return View(customerList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCompany()
        {
            try
            {
                var companyList = await _companyConfigurationServices.GetAllCompany();
                if (Request.IsAjaxRequest())
                    return Json(companyList);
                else
                    return View(companyList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CompanyConfigurationSave([FromBody] CompanyConfigrationRequestDto requestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;

                if (requestDto != null)
                {
                    var result = await _companyConfigurationServices.AddCompanyConfiguration(requestDto);
                    return Json(new { result = "Success" });
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

        [HttpPut]
        public async Task<IActionResult> EditCompanyConfigurationList([FromBody] CompanyConfigrationRequestDto requestDto)
        {
            try
            {
                int locationId = requestDto.CompanyConfigrationId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                var result = await _companyConfigurationServices.EditCompanyConfiguration(requestDto);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

    }
}
