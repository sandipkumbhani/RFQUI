using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using RFQ.UI.Domain.Helper;
using System.Net.Mail;
using System.Text;
using RFQ.UI.Application.Provider;
using RFQ.UI.Infrastructure.Provider;
using RFQ.UI.Domain.Enum;
using System.Numerics;
using AutoMapper;

namespace RFQ.UI.Controllers
{
    public class RequestForQuoteController : BaseController
    {
        private readonly IRequestForQuoteService _requestForQuoteService;
        private readonly ILogger<RequestForQuoteController> _logger;
        private readonly IRfqLinkService _rfqLinkService;
        private readonly IWhatsAppService _whatsAppService;
        private readonly IEmailService _emailService;
        private readonly GlobalClass _globalClass;
        private readonly IRfqRecipientService _rfqRecipientService;
        private readonly IMapper _mapper;


        public RequestForQuoteController(IRequestForQuoteService requestForQuoteService, GlobalClass globalClass, ILogger<RequestForQuoteController> logger, IRfqLinkService rfqLinkService, IWhatsAppService whatsAppService, IEmailService emailService, IMenuServices menuServices, IRfqRecipientService rfqRecipientService, IMapper mapper) : base(menuServices, globalClass)
        {
            _requestForQuoteService = requestForQuoteService;
            _logger = logger;
            _rfqLinkService = rfqLinkService;
            _whatsAppService = whatsAppService;
            _emailService = emailService;
            _globalClass = globalClass;
            _rfqRecipientService = rfqRecipientService;
            _mapper = mapper;
        }
        public async Task<ActionResult> VendorRequest()
        {
            await SetMenuAsync();
            return View();
        }
        public ActionResult Details(int id)
        {
            return View();
        }
        public async Task<ActionResult> RFQDetails()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVehicleIndentList([FromQuery] int companyId)
        {
            try
            {
                var result = await _requestForQuoteService.GetAllVehicleIndentList(companyId);
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetRfqNo()
        {
            try
            {
                var result = await _requestForQuoteService.GetRfqNo();
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddRfq([FromBody] RequestForQuoteRequestDto requestForQouteRequestDto)
        {
            try
            {
                List<RfqRecipientResponseDto> RfqRecipientsList = new();
                List<RfqLinkRequestDto> RfqSendlinkList = new();

                if (requestForQouteRequestDto != null)
                {
                    requestForQouteRequestDto.RfqRequestDto.CompanyId = _globalClass.CompanyId;
                    requestForQouteRequestDto.RfqRequestDto.CreatedBy = _globalClass.UserId;
                    requestForQouteRequestDto.RfqRequestDto.UpdatedBy = _globalClass.UserId;
                    requestForQouteRequestDto.RfqRequestDto.StatusId = (int)EStatus.IsActive;

                    var result = await _requestForQuoteService.AddRfq(requestForQouteRequestDto);
                    if (result != null && result.RfqRecipients.Count > 0)
                    {
                        RfqRecipientsList = result.RfqRecipients;
                        foreach (var vendor in RfqRecipientsList)
                        {
                            //RfqQuoteRateVendorDetails data = await _requestForQuoteService.GetRfqQuoteRateVendorDetailsqById(vendor.RfqId);
                            var data = new
                            {
                                VendorId = vendor.VendorId,
                                RfqId = vendor.RfqId
                            };
                            if (data != null)
                            {
                                string? formLink = Url.Action("QuoteRateVendor", "QuoteRateVendor", data, Request.Scheme) ?? string.Empty;
                                //string? link = await GetShortUrl(formLink);
                                //bool check = await _whatsAppService.SendWhatsAppMessageAsync(data.WhatsAppNo, formLink);
                                bool check = await SendEmail(vendor, formLink);
                                if (check)
                                {
                                    RfqSendlinkList.Add(new RfqLinkRequestDto
                                    {
                                        RfqId = vendor.RfqId,
                                        VendorId = vendor.VendorId,
                                        CreatedBy = _globalClass.UserId,
                                        SharedLink = formLink,
                                        CreatedOn = DateTime.UtcNow
                                    });
                                }
                            }
                        }
                        bool addlinkCheck = await _rfqLinkService.AddRfqLinkData(RfqSendlinkList);
                    }
                    return Json(result);
                }
                else
                    return Json(new { result = "failure" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> GetAllRfq([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _requestForQuoteService.GetAllRfq(pagingParam);
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
        public async Task<IActionResult> UpdateRfq([FromBody] RequestForQuoteRequestDto requestForQuoteRequestDto)
        {
            try
            {
                List<RfqLinkRequestDto> RfqSendlinkList = new();
                if (requestForQuoteRequestDto.RfqRequestDto.RfqId <= 0)
                {
                    return Json(new { result = "error", message = "Invalid RfqId." });
                }
                int rfqId = requestForQuoteRequestDto.RfqRequestDto.RfqId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                requestForQuoteRequestDto.RfqRequestDto.CompanyId = Convert.ToInt32(companyId);
                requestForQuoteRequestDto.RfqRequestDto.CreatedBy = Convert.ToInt32(userid);
                requestForQuoteRequestDto.RfqRequestDto.UpdatedBy = Convert.ToInt32(userid);
                var result = await _requestForQuoteService.UpdateRfq(rfqId, requestForQuoteRequestDto);

                if (result != null)
                {
                    bool updatecheck = await _rfqRecipientService.UpdateRfqRecipient(rfqId, requestForQuoteRequestDto.RfqRecipients);
                    if (updatecheck)
                    {

                        foreach (var item in requestForQuoteRequestDto.RfqRecipients)
                        {
                            var body = new
                            {
                                VendorId = item.VendorId,
                                RfqId = rfqId
                            };
                            string? formLink = Url.Action("QuoteRateVendor", "QuoteRateVendor", body, Request.Scheme) ?? string.Empty;
                            var vendor = _mapper.Map<RfqRecipientResponseDto>(item);
                            bool check = await SendEmail(vendor, formLink);
                            if (check)
                            {
                                RfqSendlinkList.Add(new RfqLinkRequestDto
                                {
                                    RfqId = vendor.RfqId,
                                    VendorId = vendor.VendorId,
                                    CreatedBy = _globalClass.UserId,
                                    SharedLink = formLink,
                                    CreatedOn = DateTime.UtcNow
                                });
                                bool addlinkCheck = await _rfqLinkService.AddRfqLinkData(RfqSendlinkList);
                            }
                        }
                    }
                    return Json(result);
                }
                else
                {
                    throw new Exception("RFQ Not Updated");
                }
            }
            catch (Exception ex)
            {
                return Json(ex);
            }
        }

        [HttpDelete("RequestForQuote/DeleteRfq/{rfqId}")]
        public async Task<IActionResult> DeleteRfq(int rfqId)
        {
            try
            {
                var result = await _requestForQuoteService.DeleteRfq(rfqId);
                return Json(result);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpGet("RequestForQuote/GetRfqByRfqNo/{rfqNo}")]
        public async Task<IActionResult> GetRfqByRfqNo(string rfqNo)
        {
            try
            {
                var result = await _requestForQuoteService.GetRfqByRfqNo(rfqNo);
                if (result != null)
                    return Json(result);
                else
                    return Json(null);
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetAllVendorListForRfq([FromBody] RfqVendorDetailsParam rfqVendorDetailsParam)
        {
            try
            {
                _logger.LogInformation("Requesting GetAllVendorListForRfq Details...");
                var result = await _requestForQuoteService.GetAllVendorListForRfq(rfqVendorDetailsParam);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                return Ok(ex);
            }
        }
        public async Task<IActionResult> GetPreviousQuotesList([FromBody] RfqVendorDetailsParam rfqVendorDetailsParam)
        {
            try
            {
                _logger.LogInformation("Requesting GetPreviousQuotesList Details...");
                var result = await _requestForQuoteService.GetPreviousQuotesList(rfqVendorDetailsParam);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                return Ok(ex);
            }
        }
        private async Task<bool> SendEmail(RfqRecipientResponseDto vendor, string formLink)
        {
            if (string.IsNullOrEmpty(vendor.EmailId) || string.IsNullOrWhiteSpace(vendor.EmailId)) return false;

            string body = "";
            body += "Dear Vendor,\n\n";
            body += "You are requested to provide your quote for the requested services/products. Please use the link below to submit your quotation:\n\n";
            body += formLink + "\n\n";
            body += "Kindly ensure that you submit your response before the specified deadline.\n\n";
            body += "If you have any questions, feel free to contact us.\n\n";
            body += "Thank you,\n";
            body += "FleetLynk Team";

            var emailRequest = new EmailRequest
            {
                ToEmail = vendor.EmailId,
                Subject = "Quote Request - FleetLynk",
                Body = body
            };
            return await _emailService.SendEmailAsync(emailRequest);
        }
    }
}
