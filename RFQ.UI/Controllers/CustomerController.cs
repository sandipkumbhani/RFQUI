using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class CustomerController : BaseController
    {
        private readonly ICustomerServices _customerServices;
        private readonly GlobalClass _globalClass;
        public CustomerController(ICustomerServices customerServices, GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _customerServices = customerServices;
            _globalClass = globalClass;
        }
        public async Task<IActionResult> Customer()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CustomerSave([FromBody] CustomerRequestDto customerRequestDto)
        {
            try
            {
                if (customerRequestDto != null)
                {
                    customerRequestDto.CompanyId = _globalClass.CompanyId;
                    customerRequestDto.CreatedBy = _globalClass.UserId;
                    customerRequestDto.UpdatedBy = _globalClass.UserId;
                    customerRequestDto.StatusId = (int)EStatus.IsActive;
                    var result = await _customerServices.AddCustomer(customerRequestDto);
                    return Json(result);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> ViewCustomer([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _customerServices.GetAllCustomer(pagingParam);
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
        public async Task<IActionResult> UpdateCustomer([FromBody] CustomerRequestDto customerRequestDto)
        {
            try
            {
                if (customerRequestDto.PartyId <= 0)
                {
                    throw new Exception("Invalid PartyId.");
                }
                int partyId = customerRequestDto.PartyId;
                customerRequestDto.CompanyId = _globalClass.CompanyId;
                customerRequestDto.CreatedBy = _globalClass.UserId;
                customerRequestDto.UpdatedBy = _globalClass.UserId;
                var result = await _customerServices.EditCustomer(partyId, customerRequestDto);
                return Json(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("409"))
                    return Conflict("Customer already exists");
                else
                    return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("Customer/DeleteCustomer/{partyId}")]

        public async Task<IActionResult> DeleteCustomer(int partyId)
        {
            try
            {
                var result = await _customerServices.DeleteCustomer(partyId);
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
        public async Task<IActionResult> GetGstKycDetails([FromBody] GstKycDetailsRequestDto gstKycDetailsRequestDto)
        {
            try
            {
                var details = await _customerServices.GetGstKycDetails(gstKycDetailsRequestDto);
                return Ok(details);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetPanKycDetails([FromBody] PanKycDetailRequestDto panKycDetailRequestDto)
        {
            try
            {
                var details = await _customerServices.GetPanKycDetails(panKycDetailRequestDto);
                return Ok(details);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCity()
        {
            try
            {
                var customerList = await _customerServices.GetAllCity();
                if (Request.IsAjaxRequest())
                    return Json(customerList);
                else
                    return View(customerList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IActionResult> GetDrpCustomerList([FromQuery] int companyId)
        {
            try
            {
                var result = await _customerServices.GetDrpCustomerList(companyId);
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

        public async Task<IActionResult> GetAutoCustomerCode()
        {
            try
            {
                int UserId = _globalClass.UserId;
                var code = await _customerServices.GetAutoCustomerCode(UserId);
                return Json(code);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
