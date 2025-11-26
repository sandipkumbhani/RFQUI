using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;


namespace RFQ.UI.Controllers
{

    public class CorporateCompanyController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly ICorporateCompanyService _corporateCompanyService;

        public CorporateCompanyController(ICorporateCompanyService corporateCompanyService, GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _corporateCompanyService = corporateCompanyService;
            _globalClass = globalClass;
        }
        public async Task<IActionResult> CorporateCompany()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CorporateCompanySave([FromBody] CorporateCompanyRequestDto corporateCompanyRequestDto)
        {
            try
            {
                if (corporateCompanyRequestDto == null)
                    throw new Exception("Invalid RequestDto");

                corporateCompanyRequestDto.LogoImage = "null";
                corporateCompanyRequestDto.CreatedBy = _globalClass.UserId;
                corporateCompanyRequestDto.UpdatedBy = _globalClass.UserId;
                corporateCompanyRequestDto.StatusId = (int)EStatus.IsActive;

                var result = await _corporateCompanyService.AddCorporateCompany(corporateCompanyRequestDto);
                return Json(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("409"))
                    return Conflict("CorporateCompany already exists");
                else
                    return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditCorporateCompany([FromBody] CorporateCompanyRequestDto corporateCompanyRequestDto)
        {
            try
            {
                int companyId = corporateCompanyRequestDto.CompanyId;
                corporateCompanyRequestDto.LogoImage = "null";
                corporateCompanyRequestDto.CreatedBy = _globalClass.UserId;
                corporateCompanyRequestDto.UpdatedBy = _globalClass.UserId;

                var result = await _corporateCompanyService.EditCorporateCompany(companyId, corporateCompanyRequestDto);
                return Json(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("409"))
                    return Conflict("CorporateCompany already exists");
                else
                    return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> ViewCorporateCompany([FromBody] PagingParam pagingParam)
        {
            try
            {
                var corporateCompanyViewModel = new CorporateCompanyResponseDto();
                var result = await _corporateCompanyService.GetCorporateCompanyAll(pagingParam);
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

        [HttpDelete("CorporateCompany/DeleteCorporateCompany/{companyId}")]
        public async Task<IActionResult> DeleteCorporateCompany(int companyId)
        {
            try
            {
                var result = await _corporateCompanyService.DeleteCorporateCompany(companyId);
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

        [HttpGet]
        public async Task<IActionResult> GetAllFranchise()
        {
            try
            {
                var franchiseList = await _corporateCompanyService.GetAllFranchise();
                if (franchiseList != null && franchiseList.Count() > 0)
                    return Json(franchiseList);
                if (Request.IsAjaxRequest())
                    return Json(franchiseList);
                else
                    return View(franchiseList);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
