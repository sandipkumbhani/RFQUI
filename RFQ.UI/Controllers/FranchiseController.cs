using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;
using System.ComponentModel;
using System.Data.SqlTypes;
using System.IdentityModel.Tokens.Jwt;
using static RFQ.UI.Domain.Model.CorporateCompanyViewModel;
using static RFQ.UI.Domain.Model.FranchiseViewModel;

namespace RFQ.UI.Controllers
{
    public class FranchiseController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IFranchiseService _fanchiseService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public FranchiseController(IFranchiseService franchiseService, GlobalClass globalClass, IWebHostEnvironment webHostEnvironment)
        {
            _fanchiseService = franchiseService;
            _globalClass = globalClass;
            _webHostEnvironment = webHostEnvironment;
        }
        public async Task<IActionResult> Franchise()
        {
            return View();
        }

        public string Upload(IFormFile file)
        {
            string uniqueFileName = "";
            if (file != null)
            {
                uniqueFileName = file.FileName + "_" + Guid.NewGuid().ToString();
            }
            return uniqueFileName;
        }

        [HttpPost]
        public async Task<IActionResult> FranchiseSave([FromBody] FranchiseViewModelDto franchiseViewModelDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;

                if (franchiseViewModelDto != null)
                {
                    var franchise = new FranchiseViewModelDto()
                    {
                        CompanyName = franchiseViewModelDto.CompanyName,
                        CompanyTypeId = 2,
                        AddressLine = franchiseViewModelDto.AddressLine,
                        CityId = franchiseViewModelDto.CityId,
                        PinCode = franchiseViewModelDto.PinCode,
                        ContactPerson = franchiseViewModelDto.ContactPerson,
                        ContactNo = franchiseViewModelDto.MobNo,
                        MobNo = franchiseViewModelDto.MobNo,
                        WhatsAppNo = franchiseViewModelDto.WhatsAppNo,
                        Email = franchiseViewModelDto.Email,
                        PANNo = franchiseViewModelDto.PANNo,
                        GSTNo = franchiseViewModelDto.GSTNo,
                        LogoImage = "logo",
                        ParentCompanyId = Convert.ToInt32(companyId),
                        LinkId = 1,
                        CreatedBy = Convert.ToInt32(companyId),
                        UpdatedBy = Convert.ToInt32(companyId),
                        CreatedOn = DateTime.Now,
                        UpdatedOn = DateTime.Now
                    };
                    var result = await _fanchiseService.AddFranchise(franchise);
                    return Json(new { result = "Success" });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetFranchiseAll(FranchiseViewModel franchiseViewModel)
        {
            try
            {
                franchiseViewModel ??= new FranchiseViewModel();
                var franchiseUserList = await _fanchiseService.GetFranchiseAll();
                if (franchiseUserList != null && franchiseUserList.Count() > 0)
                {
                    franchiseViewModel.franchiseViewModelDtos.AddRange(franchiseUserList);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(franchiseViewModel);
                }
                else
                {
                    return View(franchiseViewModel);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditFranchise([FromBody] FranchiseViewModelDto franchiseViewModelDto)
        {
            try
            {
                int companyId = franchiseViewModelDto.CompanyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string parentId = jwt.Claims.First(c => c.Type == "companyid").Value;

                var franchise = new FranchiseViewModelDto()
                {
                    CompanyName = franchiseViewModelDto.CompanyName,
                    CompanyTypeId = 2,
                    AddressLine = franchiseViewModelDto.AddressLine,
                    CityId = franchiseViewModelDto.CityId,
                    PinCode = franchiseViewModelDto.PinCode,
                    ContactPerson = franchiseViewModelDto.ContactPerson,
                    ContactNo = franchiseViewModelDto.MobNo,
                    MobNo = franchiseViewModelDto.MobNo,
                    WhatsAppNo = franchiseViewModelDto.WhatsAppNo,
                    Email = franchiseViewModelDto.Email,
                    PANNo = franchiseViewModelDto.PANNo,
                    GSTNo = franchiseViewModelDto.GSTNo,
                    LogoImage = "logo",
                    ParentCompanyId = Convert.ToInt32(parentId),
                    LinkId = 1,
                    CreatedBy = Convert.ToInt32(parentId),
                    UpdatedBy = Convert.ToInt32(parentId),
                    CreatedOn = DateTime.Now,
                    UpdatedOn = DateTime.Now
                };
                var result = await _fanchiseService.EditFranchise(companyId, franchise);
                if (result != null)
                {
                    return Json(new { result = "Success" });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpDelete("Franchise/DeleteFranchise/{companyId}")]
        public async Task<IActionResult> DeleteFranchise(int companyId)
        {
            try
            {
                var result = await _fanchiseService.DeleteFranchise(companyId);
                if (result != null)
                {
                    return Json(new { result = "Success" });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }
    }
}