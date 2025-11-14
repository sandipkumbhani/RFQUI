using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class CompanyConfigurationController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly ICompanyConfigurationServices _companyConfigurationServices;
        private readonly IMenuServices _menuServices;
        public CompanyConfigurationController(GlobalClass globalClass, ICompanyConfigurationServices companyConfigrationServices, IMenuServices menuServices) : base(menuServices, globalClass)
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
                if (companyConfigrationRequestDto != null)
                {
                    companyConfigrationRequestDto.StatusId = (int)EStatus.IsActive;
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
                if (ex.Message.Contains("409"))
                    return StatusCode(StatusCodes.Status409Conflict, "Duplicate Record");
                else
                    return Json(ex);
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
                if (ex.Message.Contains("409"))
                    return StatusCode(StatusCodes.Status409Conflict, "Duplicate Record");
                else
                    return Json(ex);
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
