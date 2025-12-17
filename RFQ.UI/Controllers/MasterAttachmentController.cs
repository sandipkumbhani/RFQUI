using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;

namespace RFQ.UI.Controllers
{
    public class MasterAttachmentController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IMasterAttachmentService _masterAttachmentService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public MasterAttachmentController(IMasterAttachmentService masterAttachmentService, GlobalClass globalClass, IWebHostEnvironment webHostEnvironment, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _masterAttachmentService = masterAttachmentService;
            _globalClass = globalClass;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        public IActionResult MasterAttachmentSave([FromBody] List<MasterAttachmentRequestDto> masterAttachmentRequestDto)
        {
            try
            {
                if (masterAttachmentRequestDto != null)
                {
                    var result = _masterAttachmentService.AddMasterAttachment(masterAttachmentRequestDto);
                    return Json(new { result = "success" });
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

        [HttpGet]
        public async Task<IActionResult> GetAllMasterAttachment(int linkId, int transactionId)
        {
            try
            {
                var attachmentList = await _masterAttachmentService.GetAllMasterAttachment();
                if (attachmentList != null && attachmentList.Count() > 0)
                {
                    var result = attachmentList.Where(x => x.TransactionId == transactionId && x.ReferenceLinkId == linkId).ToList();

                    return Json(result);
                }
                else
                {
                    return Json(attachmentList);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMasterAttachmentType()
        {
            try
            {
                var attachmentList = await _masterAttachmentService.GetAllMasterAttachmentType();
                if (attachmentList != null && attachmentList.Count() > 0)
                    return Json(attachmentList);
                if (Request.IsAjaxRequest())
                    return Json(attachmentList);
                else
                    return View(attachmentList);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpDelete("MasterAttachment/DeleteMasterAttachment/{attachmentId}")]
        public async Task<ActionResult> DeleteMasterAttachment(int attachmentId)
        {
            try
            {
                var result = await _masterAttachmentService.DeleteMasterAttachment(attachmentId);
                if (result != null)
                    return Ok(result);
                else
                    return Json(new { result = "failure" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }

        }

        [HttpDelete("MasterAttachment/DeleteMasterAttachmentTable/{attachmentId}")]
        public async Task<IActionResult> DeleteMasterAttachmentTable(int attachmentId)
        {
            try
            {
                var result = await _masterAttachmentService.DeleteMasterAttachmentTable(attachmentId);
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

        [HttpPut]
        public async Task<IActionResult> UpdateMasterAttachment([FromBody] List<MasterAttachmentRequestDto> masterAttachmentRequestDto)
        {
            try
            {
                if (masterAttachmentRequestDto == null || !masterAttachmentRequestDto.Any())
                {
                    return BadRequest("Request list is empty.");
                }
                int attachmentId = masterAttachmentRequestDto.First().AttachmentId;
                var result = await _masterAttachmentService.UpdateMasterAttachment(masterAttachmentRequestDto);
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

        [HttpPost]
        public async Task<IActionResult> UploadAttachment(IFormFile file)
        {
            try
            {
                string uniqueFileName = "";
                if (file != null)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "AttachmentFiles");
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
        public IActionResult DeleteAttachment(string fileName)
        {
            try
            {
                int attachmentId = 0;
                if (string.IsNullOrEmpty(fileName))
                {
                    return Json(new { result = "Error", message = "File name is required." });
                }
                var attachmentList =  _masterAttachmentService.GetAllMasterAttachment();
                if(attachmentList.Result.Count()>0)
                {
                    attachmentId = attachmentList.Result.Where(x => x.AttachmentPath == fileName).Select(x=>x.AttachmentId).FirstOrDefault();
                }

                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "AttachmentFiles");
                string filePath = Path.Combine(uploadsFolder, fileName);

                if (System.IO.File.Exists(filePath))
                {

                    System.IO.File.Delete(filePath);
                    _masterAttachmentService.DeleteMasterAttachmentTable(attachmentId);
                    return Json(new { result = "Success", message = "File Deleted Successfully." });
                }
                else
                {
                    return Json(new { result = "Error", message = "File Already Deleted." });
                }

            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }
    }
}
