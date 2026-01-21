using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class RFQFinalizationController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IRfqFinalService _rfqFinalService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;

        public RFQFinalizationController(IRfqFinalService rfqFinalService, GlobalClass globalClass, IEmailService emailService, IConfiguration config, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _rfqFinalService = rfqFinalService;
            _globalClass = globalClass;
            _emailService = emailService;
            _config = config;
        }
        public async Task<IActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }
        public async Task<IActionResult> RFQFinalization()
        {
            await SetMenuAsync();
            return View("Views/RFQ/RFQFinalization.cshtml");
        }
        [HttpPost]
        public async Task<IActionResult> AddRfqFinal([FromBody] RfqFinalizationSaveRequestDto requestDto)
        {
            try
            {
                if (requestDto != null)
                {
                    requestDto.RfqFinalDto.CreatedBy = _globalClass.UserId;
                    requestDto.RfqFinalDto.UpdatedBy = _globalClass.UserId;
                    requestDto.RfqFinalDto.StatusId = (int)EStatus.IsActive;
                    var result = await _rfqFinalService.AddRfqFinal(requestDto);
                    return Json(result);
                }
                else
                {
                    return Json(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRfqFinal([FromBody] RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto)
        {
            try
            {
                int rfqFinalId = rfqFinalizationSaveRequestDto.RfqFinalDto.RfqFinalIdId;
                if (rfqFinalizationSaveRequestDto != null)
                {
                    rfqFinalizationSaveRequestDto.RfqFinalDto.CreatedBy = _globalClass.UserId;
                    rfqFinalizationSaveRequestDto.RfqFinalDto.UpdatedBy = _globalClass.UserId;
                    var result = await _rfqFinalService.UpdateRfqFinal(rfqFinalId, rfqFinalizationSaveRequestDto);
                    return Json(result);
                }
                else
                {
                    return Json(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpGet("RFQFinalization/AwardedVendor/{id}")]
        public async Task<IActionResult> AwardedVendor(int id)
        {
            try
            {
                var routeList = await _rfqFinalService.AwardedVendor(id);
                if (Request.IsAjaxRequest())
                    return Json(routeList);
                else
                    return View(routeList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetAllRfqFinalization([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _rfqFinalService.GetAllRfqFinalization(pagingParam);
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
        [HttpGet]
        public async Task<IActionResult> GetRfqFinalRateList([FromQuery] int rfqFinalId)
        {
            try
            {
                var result = await _rfqFinalService.GetRfqFinalRateList(rfqFinalId);
                if (Request.IsAjaxRequest())
                    return Json(result);
                else
                    return View(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpDelete("RFQFinalization/DeleteRfqFinal/{rfqFinalId}")]
        public async Task<IActionResult> DeleteRfqFinal(int rfqFinalId)
        {
            try
            {
                var result = await _rfqFinalService.DeleteRfqFinal(rfqFinalId);
                if (result)
                    return Json(result);
                else
                    return Json(false);
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetRfqDrpList([FromQuery] int companyId)
        {
            try
            {
                var result = await _rfqFinalService.GetRfqDrpList(companyId);
                if (Request.IsAjaxRequest())
                    return Json(result);
                else
                    return View(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SendAssignOrder([FromBody] AssignOrderRequestDto requestDto)
        {
            try
            {
                var CheckBoxData = requestDto.Vendors;
                foreach (var item in CheckBoxData)
                {
                    var emailRequest = new EmailRequest
                    {
                        ToEmail = item.Email,
                        Subject = $"New Order Assigned",
                        Body = $@"
                                <html>
                                    <body style='font-family: Arial, sans-serif;'>
                                        <h2>Dear {item.VendorName},</h2>
                                
                                        <p>
                                            We are pleased to inform you that you have been
                                            <strong>assigned a new order</strong>.
                                        </p>
                                
                                        <p>
                                            <b>Order Details:</b><br/><br/>
                                
                                            Vehicle Req On: {requestDto.VehicleReqOn:dd MMM yyyy}<br/>
                                            Vehicle Type: {requestDto.VehicleType}<br/>
                                            Required Vehicle Count: {item.AssignedVehicles}<br/>
                                            Origin/From: {requestDto.FromLocation}<br/>
                                            Destination/To: {requestDto.ToLocation}<br/>
                                            Total Hire Cost: ₹ {item.TotalHireCost}
                                        </p>
                                
                                        <p style='margin-top:20px;'>
                                            Best Regards,<br/>
                                            FleetLynk Team
                                        </p>
                                    </body>
                                </html>",
                        IsHtml = true
                    };
                    bool check = await _emailService.SendEmailAsync(emailRequest);
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                return Ok(false);
            }
        }
    }
}