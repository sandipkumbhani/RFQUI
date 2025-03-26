using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;
using static RFQ.UI.Domain.Model.CorporateCompanyViewModel;


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
        public IActionResult CorporateCompanySave([FromBody] CorporateCompanyViewModelDto corporateCompanyViewModelDto)
        {
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

            string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

            if (corporateCompanyViewModelDto != null)
            {
                var Company = new CorporateCompanyViewModelDto()
                {
                    CompanyTypeId = Convert.ToInt32(profileid),

                    CompanyName = corporateCompanyViewModelDto.CompanyName,
                    AddressLine = corporateCompanyViewModelDto.AddressLine,
                    CityId = corporateCompanyViewModelDto.CityId,
                    PinCode = corporateCompanyViewModelDto.PinCode,
                    ContactPerson = corporateCompanyViewModelDto.ContactPerson,
                    ContactNo = corporateCompanyViewModelDto.ContactNo,
                    MobNo = corporateCompanyViewModelDto.MobNo,
                    WhatsAppNo = corporateCompanyViewModelDto.WhatsAppNo,
                    Email = corporateCompanyViewModelDto.Email,
                    PANNo = corporateCompanyViewModelDto.PANNo,
                    GSTNo = corporateCompanyViewModelDto.GSTNo,

                    CreatedBy = Convert.ToInt32(profileid),
                    UpdatedBy = Convert.ToInt32(profileid)
                };
                var result = _corporateCompanyService.AddCorporateCompany(Company);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });

            }
        }


        [HttpPut]
        public async Task<IActionResult> EditCorporateCompany([FromBody] CorporateCompanyViewModelDto corporateCompanyViewModelDto)
        {
            try
            {
                int companyId = corporateCompanyViewModelDto.CompanyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                //string companyTypeId = jwt.Claims.First(c => c.Type == "companyTypeId").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                var company = new CorporateCompanyViewModelDto
                {
                    CompanyTypeId = 3,

                    CompanyName = corporateCompanyViewModelDto.CompanyName,
                    AddressLine = corporateCompanyViewModelDto.AddressLine,
                    CityId = corporateCompanyViewModelDto.CityId,
                    PinCode = corporateCompanyViewModelDto.PinCode,
                    ContactPerson = corporateCompanyViewModelDto.ContactPerson,
                    ContactNo = corporateCompanyViewModelDto.ContactNo,
                    MobNo = corporateCompanyViewModelDto.MobNo,
                    WhatsAppNo = corporateCompanyViewModelDto.WhatsAppNo,
                    Email = corporateCompanyViewModelDto.Email,
                    PANNo = corporateCompanyViewModelDto.PANNo,
                    GSTNo = corporateCompanyViewModelDto.GSTNo,

                    CreatedBy = Convert.ToInt32(profileid),
                    UpdatedBy = Convert.ToInt32(profileid)
                };
                var result = await _corporateCompanyService.EditCorporateCompany(companyId, company);
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
        public async Task<IActionResult> ViewCorporateCompany(CorporateCompanyViewModel corporateCompanyViewModel)
        {
            try
            {
                corporateCompanyViewModel ??= new CorporateCompanyViewModel();
                var userlist = await _corporateCompanyService.GetCorporateCompanyAll();
                if (userlist != null && userlist.Count() > 0)
                {
                    corporateCompanyViewModel.corporateCompanyViewModelDto.AddRange(userlist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(corporateCompanyViewModel);
                }
                else
                {
                    return View(corporateCompanyViewModel);
                }
            }
            catch (Exception ex)
            {
                throw;
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
    }
}
