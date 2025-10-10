using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class CompanyConfigurationController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly ICompanyConfigurationServices _companyConfigurationServices;
        private readonly IMenuServices _menuServices;
        public CompanyConfigurationController(GlobalClass globalClass, ICompanyConfigurationServices companyConfigrationServices,IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _companyConfigurationServices = companyConfigrationServices;
            _menuServices = menuServices;
        }
        public async Task<ActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetAllCompanyConfiguration([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _companyConfigurationServices.GetAllCompanyConfiguration(pagingParam);
                if (Request.IsAjaxRequest())
                {
                    return Json(new
                    {
                        draw = result.PageNumber,
                        recordsTotal = result.TotalRecordCount,
                        recordsFiltered = result.TotalRecordCount,
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

        [HttpGet]
        public async Task<IActionResult> GetAllProviders()
        {
            try
            {
                var providersList = await _companyConfigurationServices.GetAllProviders();
                if (Request.IsAjaxRequest())
                    return Json(providersList);
                else
                    return View(providersList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CompanyConfigurationSave([FromBody] CompanyConfigrationRequestDto companyConfigrationRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;

                if (companyConfigrationRequestDto != null)
                {
                    var result = await _companyConfigurationServices.AddCompanyConfiguration(companyConfigrationRequestDto);
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
        public async Task<IActionResult> EditCompanyConfigurationList([FromBody] CompanyConfigrationRequestDto companyConfigrationRequestDto)
        {
            try
            {
                var result = await _companyConfigurationServices.EditCompanyConfiguration(companyConfigrationRequestDto);
                if (result != null)
                    return Json(new { result = "success" });
                else
                    return Json(new { result = "failure" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
        [HttpDelete("CompanyConfiguration/DeleteCompanyConfiguration/{CompanyConfigId}")]
        public async Task<IActionResult> DeleteCompanyConfiguration(int CompanyConfigId)
        {
            try
            {
                var result = await _companyConfigurationServices.DeleteCompanyConfiguration(CompanyConfigId);
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
