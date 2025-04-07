using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class MasterAttachmentController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IMasterAttachmentService _masterAttachmentService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public MasterAttachmentController(IMasterAttachmentService masterAttachmentService, GlobalClass globalClass ,IWebHostEnvironment webHostEnvironment)
        {
            _masterAttachmentService = masterAttachmentService;
            _globalClass = globalClass;
            _webHostEnvironment = webHostEnvironment;
        }


        [HttpPost]
        public IActionResult MasterAttachmentSave([FromBody] List<MasterAttachmentRequestDto> masterAttachmentRequestDto)
        {
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

            string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

            if (masterAttachmentRequestDto != null)
            {
                
                //masterAttachmentRequestDto.CreatedBy = Convert.ToInt32(profileid);
                //masterAttachmentRequestDto.UpdatedBy = Convert.ToInt32(profileid);


                var result = _masterAttachmentService.AddMasterAttachment(masterAttachmentRequestDto);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });

            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMasterAttachment(int linkId, int transactionId)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                int profileID = Convert.ToInt32(profileid);
                var attachmentList = await _masterAttachmentService.GetAllMasterAttachment();


                if (attachmentList != null && attachmentList.Count() > 0)
                {
                    var result = attachmentList.Where(x => x.TransactionId == transactionId && x.ReferenceLinkId == linkId).ToList();

                    return Json(result);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(attachmentList);
                }
                else
                {
                    return View(attachmentList);
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
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                int profileID = Convert.ToInt32(profileid);
                var attachmentList = await _masterAttachmentService.GetAllMasterAttachmentType();
                if (attachmentList != null && attachmentList.Count() > 0)
                {
                    return Json(attachmentList);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(attachmentList);
                }
                else
                {
                    return View(attachmentList);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpDelete("MasterAttachment/DeleteMasterAttachment/{attachmentId}")]
        public async Task<IActionResult> DeleteCorporateCompany(int attachmentId)
        {
            try
            {
                var result = await _masterAttachmentService.DeleteMasterAttachment(attachmentId);
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

        [HttpPut]
        public async Task<IActionResult> UpdateMasterAttachment([FromBody] MasterAttachmentRequestDto masterAttachmentRequestDto)
        {
            try
            {
                int attachmentId = masterAttachmentRequestDto.AttachmentId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                //masterAttachmentRequestDto .CreatedBy = Convert.ToInt32(profileid);
                //masterAttachmentRequestDto.UpdatedBy = Convert.ToInt32(profileid);

                var result = await _masterAttachmentService.UpdateMasterAttachment(attachmentId, masterAttachmentRequestDto);
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
        public async Task<IActionResult> UploadAttachment(IFormFile file)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;

                string uniqueFileName = "";
                if (file != null)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "AttachmentFiles");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }
                    uniqueFileName = DateTime.Now.ToString("MM/dd/yyyy") + "_" + file.FileName;
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
    }
}
