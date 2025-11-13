using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class DeliveryOrCloseTripController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IDeliveryOrCloseTripService _deliveryOrCloseTripService;
        private readonly ILogger<DeliveryOrCloseTripController> _logger;
        private readonly IMenuServices _menuServices;

        public DeliveryOrCloseTripController(IDeliveryOrCloseTripService deliveryOrCloseTripService,ILogger<DeliveryOrCloseTripController> logger,IMenuServices menuServices,GlobalClass globalClass) : base(menuServices, globalClass)
        {
            _deliveryOrCloseTripService = deliveryOrCloseTripService;
            _logger = logger;
            _globalClass = globalClass;
            _menuServices = menuServices;
        }
        public async Task<IActionResult> DeliveryOrCloseTrip()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GenerateDocumentNo()
        {
            try
            {
                var result = await _deliveryOrCloseTripService.GenerateDocumentNo();
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddDelivery([FromBody] DeliveryOrCloseTripRequestDto deliveryOrCloseTripRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                if (deliveryOrCloseTripRequestDto != null)
                {

                    deliveryOrCloseTripRequestDto.CreatedBy = Convert.ToInt32(userid);
                    deliveryOrCloseTripRequestDto.UpdatedBy = Convert.ToInt32(userid);
                    deliveryOrCloseTripRequestDto.CompanyId = Convert.ToInt32(companyId);
                    var result = await _deliveryOrCloseTripService.AddDelivery(deliveryOrCloseTripRequestDto);
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
        public async Task<IActionResult> GetAllDelivery([FromBody] PagingParam pagingParam)
        {
            try
            {
                var vehiclePlacementViewModel = new DeliveryOrCloseTripResponseDto();
                var result = await _deliveryOrCloseTripService.GetAllDelivery(pagingParam);
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
        public async Task<IActionResult> UpdateDelivery([FromBody] DeliveryOrCloseTripRequestDto deliveryOrCloseTripRequestDto)
        {
            try
            {
                int deliveryId = deliveryOrCloseTripRequestDto.DeliveryId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                deliveryOrCloseTripRequestDto.CreatedBy = Convert.ToInt32(userid);
                deliveryOrCloseTripRequestDto.UpdatedBy = Convert.ToInt32(userid);
                deliveryOrCloseTripRequestDto.CompanyId = Convert.ToInt32(companyId);
                var result = await _deliveryOrCloseTripService.UpdateDelivery(deliveryId, deliveryOrCloseTripRequestDto);
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

        [HttpDelete("DeliveryOrCloseTrip/DeleteDelivery/{deliveryId}")]
        public async Task<IActionResult> DeleteDelivery(int deliveryId)
        {
            try
            {
                var result = await _deliveryOrCloseTripService.DeleteDelivery(deliveryId);
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
    }
}
