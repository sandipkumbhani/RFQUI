using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class BookingOrTripController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IBookingOrTripService _bookingOrTripService;
        private readonly ILogger<BookingOrTripController> _logger;
        private readonly IMenuServices _menuServices;
        private readonly IBokingInvoiceService _bookingInvoiceService;
        public BookingOrTripController(IBookingOrTripService bookingOrTripService, GlobalClass globalClass, ILogger<BookingOrTripController> logger, IMenuServices menuServices, IBokingInvoiceService bokingInvoiceService) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _bookingOrTripService = bookingOrTripService;
            _logger = logger;
            _menuServices = menuServices;
            _bookingInvoiceService = bokingInvoiceService;
        }
        public async Task<IActionResult> BookingOrTrip()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> AddBookingOrTrip([FromBody] BookingOrTripRequestDto bookingOrTripRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                if (bookingOrTripRequestDto != null)
                {

                    bookingOrTripRequestDto.CreatedBy = Convert.ToInt32(userid);
                    bookingOrTripRequestDto.UpdatedBy = Convert.ToInt32(userid);
                    bookingOrTripRequestDto.CompanyId = Convert.ToInt32(companyId);
                    bookingOrTripRequestDto.StatusId = (int)EStatus.IsActive;
                    var result = await _bookingOrTripService.AddBookingOrTrip(bookingOrTripRequestDto);
                    return Json(new { result });
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

        [HttpPost]
        public async Task<IActionResult> GetAllBookingOrTrip([FromBody] PagingParam pagingParam)
        {
            try
            {
                var vehiclePlacementViewModel = new VehiclePlacementResponseDto();
                var result = await _bookingOrTripService.GetAllBookingOrTrip(pagingParam);
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
        public async Task<IActionResult> UpdateBookingOrTrip([FromBody] BookingOrTripRequestDto bookingOrTripRequestDto)
        {
            try
            {
                int bookingId = bookingOrTripRequestDto.BookingId ?? 0;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                bookingOrTripRequestDto.CreatedBy = Convert.ToInt32(userid);
                bookingOrTripRequestDto.UpdatedBy = Convert.ToInt32(userid);
                bookingOrTripRequestDto.CompanyId = Convert.ToInt32(companyId);
                var result = await _bookingOrTripService.UpdateBookingOrTrip(bookingId, bookingOrTripRequestDto);
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

        [HttpDelete("BookingOrTrip/DeleteBookingOrTrip/{bookingId}")]
        public async Task<IActionResult> DeleteBookingOrTrip(int bookingId)
        {
            try
            {
                var result = await _bookingOrTripService.DeleteBookingOrTrip(bookingId);
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
        public async Task<IActionResult> GetAllLRNo([FromQuery] int companyId)
        {
            try
            {
                var result = await _bookingOrTripService.GetAllLRNo(companyId);
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("BookingOrTrip/AutoFetchBooking/{id}")]
        public async Task<IActionResult> AutoFetchBooking(int id)
        {
            try
            {
                var routeList = await _bookingOrTripService.AutoFetchBooking(id);
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


        public async Task<ActionResult> GetBookingInvoiceListByBookingId(int id)
        {
            try
            {
                _logger.LogInformation(" GetBookingInvoiceListByBookingId Details....");
                //var result = await _bookingInvoiceService.GetBookingInvoiceListByBookingId(id);
                //return Ok(result);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw;
            }
        }

    }
}
