using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
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

        [HttpPost]
        public async Task<IActionResult> CorporateCompanySave([FromBody] CorporateCompanyRequestDto corporateCompanyViewModelDto)
        {
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

            string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
            corporateCompanyViewModelDto.LogoImage = "null";
            if (corporateCompanyViewModelDto != null)
            {
                corporateCompanyViewModelDto.CreatedBy = Convert.ToInt32(profileid);
                corporateCompanyViewModelDto.UpdatedBy = Convert.ToInt32(profileid);

                var result = await _corporateCompanyService.AddCorporateCompany(corporateCompanyViewModelDto);
                return Json(new { result });
            }
            else
            {
                return Json(new { result = "fail" });

            }
        }


        [HttpPut]
        public async Task<IActionResult> EditCorporateCompany([FromBody] CorporateCompanyRequestDto corporateCompanyViewModelDto)
        {
            try
            {
                int companyId = corporateCompanyViewModelDto.CompanyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                corporateCompanyViewModelDto.LogoImage = "null";
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                corporateCompanyViewModelDto.CreatedBy = Convert.ToInt32(profileid);
                corporateCompanyViewModelDto.UpdatedBy = Convert.ToInt32(profileid);

                var result = await _corporateCompanyService.EditCorporateCompany(companyId, corporateCompanyViewModelDto);
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
        public async Task<IActionResult> ViewCorporateCompany()
        {
            try
            {

                var coporateCompanyList = await _corporateCompanyService.GetCorporateCompanyAll();

                if (Request.IsAjaxRequest())
                {
                    return Json(coporateCompanyList);
                }
                else
                {
                    return View(coporateCompanyList);
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
