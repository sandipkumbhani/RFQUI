using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class DriverController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IDriverServices _driverServices;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public DriverController(IDriverServices driverServices, GlobalClass globalClass, IWebHostEnvironment webHostEnvironment, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _driverServices = driverServices;
            _globalClass = globalClass;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<ActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ViewDriver([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _driverServices.GetAllDriver(pagingParam);
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

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            try
            {
                string uniqueFileName = "";
                if (file != null)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "driverphoto");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }
                    uniqueFileName = DateTime.Now.ToString("dd-MM-yyyy") + "_" + file.FileName;
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
                var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "driverphoto", fileName);
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
        public async Task<IActionResult> GetDlKycDetails([FromBody] LicenseKycDetailsRequestDto licenseKycDetailsRequestDto)
        {
            try
            {
                var details = await _driverServices.GetDlKycDetails(licenseKycDetailsRequestDto);
                return Ok(details);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDriverType()
        {
            try
            {

                var driverTypeList = await _driverServices.GetDriverType();
                if (driverTypeList != null && driverTypeList.Count() > 0)
                    return Json(driverTypeList);
                if (Request.IsAjaxRequest())
                    return Json(driverTypeList);
                else
                    return View(driverTypeList);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        public IActionResult DriverSave([FromBody] DriverRequestDto driverRequestDto)
        {
            if (driverRequestDto != null)
            {
                driverRequestDto.CreatedBy = _globalClass.UserId;
                driverRequestDto.UpdatedBy = _globalClass.UserId;
                var result = _driverServices.AddDriver(driverRequestDto);
                return Json(new { result });
            }
            else
            {
                return Json(new { result = "fail" });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateDriver([FromBody] DriverRequestDto driverRequestDto)
        {
            try
            {
                if (driverRequestDto.DriverId <= 0)
                {
                    return Json(new { result = "error", message = "Invalid DriverId." });
                }
                int driverId = driverRequestDto.DriverId;
                driverRequestDto.CreatedBy = _globalClass.UserId;
                driverRequestDto.UpdatedBy = _globalClass.UserId;
                var result = await _driverServices.EditDriver(driverId, driverRequestDto);
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

        [HttpDelete("Driver/DeleteDriver/{driverId}")]
        public async Task<IActionResult> DeleteDriver(int driverId)
        {
            try
            {
                var result = await _driverServices.DeleteDriver(driverId);
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
        public async Task<IActionResult> GetAllDriverList()
        {
            try
            {
                var driverlist = await _driverServices.GetAllDriverList();
                if (Request.IsAjaxRequest())
                    return Json(driverlist);
                else
                    return Json(driverlist);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDriverCode()
        {
            try
            {
                var result = await _driverServices.GetDriverCode();
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
