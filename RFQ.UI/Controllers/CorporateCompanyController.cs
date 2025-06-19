using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;


namespace RFQ.UI.Controllers
{

    public class CorporateCompanyController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly ICorporateCompanyService _corporateCompanyService;

        public CorporateCompanyController(ICorporateCompanyService corporateCompanyService, GlobalClass globalClass)
        {
            _corporateCompanyService = corporateCompanyService;
            _globalClass = globalClass;
        }
        public IActionResult CorporateCompany()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CorporateCompanySave([FromBody] CorporateCompanyRequestDto corporateCompanyRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                corporateCompanyRequestDto.LogoImage = "null";
                if (corporateCompanyRequestDto != null)
                {
                    corporateCompanyRequestDto.CreatedBy = Convert.ToInt32(profileid);
                    corporateCompanyRequestDto.UpdatedBy = Convert.ToInt32(profileid);

                    var result = await _corporateCompanyService.AddCorporateCompany(corporateCompanyRequestDto);
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

        [HttpPut]
        public async Task<IActionResult> EditCorporateCompany([FromBody] CorporateCompanyRequestDto corporateCompanyRequestDto)
        {
            try
            {
                int companyId = corporateCompanyRequestDto.CompanyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                corporateCompanyRequestDto.LogoImage = "null";
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                corporateCompanyRequestDto.CreatedBy = Convert.ToInt32(profileid);
                corporateCompanyRequestDto.UpdatedBy = Convert.ToInt32(profileid);

                var result = await _corporateCompanyService.EditCorporateCompany(companyId, corporateCompanyRequestDto);
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

        [HttpGet]
        public async Task<IActionResult> GetAllFranchise()
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                int profileID = Convert.ToInt32(profileid);
                var franchiseList = await _corporateCompanyService.GetAllFranchise();
                if (franchiseList != null && franchiseList.Count() > 0)
                {
                    return Json(franchiseList);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(franchiseList);
                }
                else
                {
                    return View(franchiseList);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
