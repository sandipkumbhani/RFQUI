using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class CustomerController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly ICustomerServices _customerServices;

        public CustomerController(ICustomerServices customerServices, GlobalClass globalClass)
        {
            _customerServices = customerServices;
            _globalClass = globalClass;
        }
        public IActionResult Customer()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CustomerSave([FromBody] CustomerRequestDto customerRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;

                if (customerRequestDto != null)
                {
                    customerRequestDto.CompanyId = Convert.ToInt32(companyId);
                    customerRequestDto.CreatedBy = Convert.ToInt32(profileId);
                    customerRequestDto.UpdatedBy = Convert.ToInt32(profileId);

                    var result = await _customerServices.AddCustomer(customerRequestDto);
                    return Json(new { result });
                }
                else
                {
                    return Json(new { result = "fail" });

                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [HttpGet]
        public async Task<IActionResult> ViewCustomer()
        {
            try
            {
                var customerList = await _customerServices.GetAllCustomer();

                if (Request.IsAjaxRequest())
                {
                    return Json(customerList);
                }
                else
                {
                    return View(customerList);
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
                    return Json(new { result = "error", message = "Invalid PartyId." });
                }
                int partyId = customerRequestDto.PartyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                customerRequestDto.CompanyId = Convert.ToInt32(companyId);
                customerRequestDto.CreatedBy = Convert.ToInt32(profileId);
                customerRequestDto.UpdatedBy = Convert.ToInt32(profileId);
                var result = await _customerServices.EditCustomer(partyId, customerRequestDto);
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

        [HttpDelete("Customer/DeleteCustomer/{partyId}")]

        public async Task<IActionResult> DeleteCustomer(int partyId)
        {
            try
            {
                var result = await _customerServices.DeleteCustomer(partyId);
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
                {
                    return Json(customerList);
                }
                else
                {
                    return View(customerList);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
