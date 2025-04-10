using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;


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
        public async Task<IActionResult> CorporateCompanySave([FromBody] CorporateCompanyRequestDto requestDto)
        {
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
            string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
            requestDto.LogoImage = "null";
            if (requestDto != null)
            {
                requestDto.CreatedBy = Convert.ToInt32(profileid);
                requestDto.UpdatedBy = Convert.ToInt32(profileid);
                var result = await _corporateCompanyService.AddCorporateCompany(requestDto);
                return Json(new { result });
            }
            else
            {
                return Json(new { result = "fail" });
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditCorporateCompany([FromBody] CorporateCompanyRequestDto requestDto)
        {
            try
            {
                int companyId = requestDto.CompanyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                requestDto.LogoImage = "null";
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                var company = new CorporateCompanyModel
                {
                    CompanyTypeId = 3,

                    CompanyName = requestDto.CompanyName,
                    AddressLine = requestDto.AddressLine,
                    CityId = requestDto.CityId,
                    PinCode = requestDto.PinCode,
                    ContactPerson = requestDto.ContactPerson,
                    ContactNo = requestDto.ContactNo,
                    MobNo = requestDto.MobNo,
                    WhatsAppNo = requestDto.WhatsAppNo,
                    Email = requestDto.Email,
                    PANNo = requestDto.PANNo,
                    GSTNo = requestDto.GSTNo,
                };
                var result = await _corporateCompanyService.EditCorporateCompany(companyId, requestDto);
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
        public async Task<IActionResult> ViewCorporateCompany(CorporateCompanyRequestDto requestDto)
        {
            try
            {
                List<CorporateCompanyModel> corporateCompanyModel = new List<CorporateCompanyModel>();
                var userlist = await _corporateCompanyService.GetCorporateCompanyAll();
                if (userlist != null && userlist.Count() > 0)
                    corporateCompanyModel.AddRange(userlist);
                if (Request.IsAjaxRequest())
                    return Json(corporateCompanyModel);
                else
                    return View(corporateCompanyModel);
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
