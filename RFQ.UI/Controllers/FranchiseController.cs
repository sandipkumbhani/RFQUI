using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
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
                    throw new Exception("Invalid RequestDto");

                franchiseRequestDto.CompanyTypeId = (int)EnumInternalMaster.FRANCHISE;
                franchiseRequestDto.ParentCompanyId = _globalClass.CompanyId;
                franchiseRequestDto.CreatedBy = _globalClass.UserId;
                franchiseRequestDto.UpdatedBy = _globalClass.UserId;
                franchiseRequestDto.CreatedOn = DateTime.Now;
                franchiseRequestDto.UpdatedOn = DateTime.Now;
                franchiseRequestDto.StatusId = (int)EStatus.IsActive;
                var result = await _fanchiseService.AddFranchise(franchiseRequestDto);
                return Json(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("409"))
                    return Conflict("Franchise already exists");
                else
                    return StatusCode(500, "Internal Server Error");
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
                if (franchiseRequestDto == null)
                    throw new Exception("Invalid RequestDto");

                franchiseRequestDto.CompanyTypeId = (int)EnumInternalMaster.FRANCHISE;
                franchiseRequestDto.ParentCompanyId = _globalClass.CompanyId;
                franchiseRequestDto.CreatedBy = _globalClass.UserId;
                franchiseRequestDto.UpdatedBy = _globalClass.UserId;
                franchiseRequestDto.CreatedOn = DateTime.Now;
                franchiseRequestDto.UpdatedOn = DateTime.Now;

                var result = await _fanchiseService.EditFranchise(franchiseRequestDto.CompanyId, franchiseRequestDto);
                return Json(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("409"))
                    return Conflict("Franchise already exists");
                else
                    return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpDelete("Franchise/DeleteFranchise/{companyId}")]
        public async Task<IActionResult> DeleteFranchise(int companyId)
        {
            try
            {
                var result = await _fanchiseService.DeleteFranchise(companyId);
                if (result != null)
                    return Json(new { result = "Success" });
                else
                    return Json(new { result = "Failed" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }
    }
}