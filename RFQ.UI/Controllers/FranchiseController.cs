using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class FranchiseController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IFranchiseService _fanchiseService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMenuServices _menuServices;
        public FranchiseController(IFranchiseService franchiseService, GlobalClass globalClass, IWebHostEnvironment webHostEnvironment, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _fanchiseService = franchiseService;
            _globalClass = globalClass;
            _webHostEnvironment = webHostEnvironment;
            _menuServices = menuServices;
        }
        public async Task<IActionResult> Franchise()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            try
            {
                string uniqueFileName = "";
                if (file != null)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "franchiselogo");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }
                    uniqueFileName = Guid.NewGuid().ToString() + "_" + DateTime.Now.ToString("MM/dd/yyyy") + "_" + file.FileName;
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                }
                return Json(new { fileName = uniqueFileName });
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteUpload(String fileName)
        {
            try
            {
                var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "franchiselogo", fileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Json(new { success = true });
                }
                return Json(new { success = false, message = "File not found" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
 
        [HttpPost]
        public async Task<IActionResult> FranchiseSave([FromBody] FranchiseRequestDto franchiseRequestDto)
        {
            try
            {
                if (franchiseRequestDto == null)
                {
                    return Json(new { success = false, message = "Invalid franchise data." });
                }

                // Parse JWT token to extract claims
                var jwtHandler = new JwtSecurityTokenHandler();
                var jwtToken = jwtHandler.ReadJwtToken(_globalClass.Token);

                string profileId = jwtToken.Claims.FirstOrDefault(c => c.Type == "profileid")?.Value;
                string companyId = jwtToken.Claims.FirstOrDefault(c => c.Type == "companyid")?.Value;
                string userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "userid")?.Value;

                if (string.IsNullOrEmpty(companyId) || string.IsNullOrEmpty(userId))
                {
                    return Json(new { success = false, message = "Token is missing required claims." });
                }

                // Set metadata
                franchiseRequestDto.CompanyTypeId = 2;
                franchiseRequestDto.ParentCompanyId = Convert.ToInt32(companyId);
                franchiseRequestDto.CreatedBy = Convert.ToInt32(userId);
                franchiseRequestDto.UpdatedBy = Convert.ToInt32(userId);
                franchiseRequestDto.CreatedOn = DateTime.Now;
                franchiseRequestDto.UpdatedOn = DateTime.Now;

                var result = await _fanchiseService.AddFranchise(franchiseRequestDto);

                if (result == null)
                {
                    return Json(new { success = false, message = "Franchise already exists with the same name." });

                }

                return Json(new { success = true, data = result });
            }
            catch (Exception ex)
            {
   
                return StatusCode(500, "An internal error occurred while saving the franchise.");
            }
        }


        [HttpPost]
        public async Task<IActionResult> GetAllFranchise([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _fanchiseService.GetAllFranchise(pagingParam);
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

        [HttpPut]
        public async Task<IActionResult> EditFranchise([FromBody] FranchiseRequestDto franchiseRequestDto)
        {
            try
            {
                int companyId = franchiseRequestDto.CompanyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string parentId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                franchiseRequestDto.CompanyTypeId = 2;
                franchiseRequestDto.ParentCompanyId = Convert.ToInt32(parentId);
                franchiseRequestDto.CreatedBy = Convert.ToInt32(userid);
                franchiseRequestDto.UpdatedBy = Convert.ToInt32(userid);
                franchiseRequestDto.CreatedOn = DateTime.Now;
                franchiseRequestDto.UpdatedOn = DateTime.Now;

                var result = await _fanchiseService.EditFranchise(companyId, franchiseRequestDto);
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