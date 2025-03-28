using System.IdentityModel.Tokens.Jwt;
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

        public MasterAttachmentController(IMasterAttachmentService masterAttachmentService, GlobalClass globalClass)
        {
            _masterAttachmentService = masterAttachmentService;
            _globalClass = globalClass;
        }


        [HttpPost]
        public IActionResult MasterAttachmentSave([FromBody] MasterAttachmentRequestDto masterAttachmentRequestDto)
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
    }
}
