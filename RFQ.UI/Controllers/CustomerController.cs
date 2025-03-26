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
        public IActionResult CustomerSave([FromBody] CustomerRequestDto customerRequestDto)
        {
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
            string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
            string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;

            if (customerRequestDto != null)
            {
                customerRequestDto.CompanyId = Convert.ToInt32(companyId);
                customerRequestDto.CreatedBy = Convert.ToInt32(profileId);
                customerRequestDto.UpdatedBy = Convert.ToInt32(profileId);

                var result = _customerServices.AddCustomer(customerRequestDto);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });

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
        public async Task<IActionResult> UpdateCustomer([FromBody] CustomerRequestDto customerViewModelDto)
        {
            try
            {
                if (customerViewModelDto.PartyId <= 0)
                {
                    return Json(new { result = "error", message = "Invalid PartyId." });
                }
                int partyId = customerViewModelDto.PartyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;

                //var customer = new CustomerViewModelDto
                //{
                //    PartyName = customerViewModelDto.PartyName,
                //    AddressLine = customerViewModelDto.AddressLine,
                //    CityId = customerViewModelDto.CityId,
                //    PinCode = customerViewModelDto.PinCode,
                //    ContactPerson = customerViewModelDto.ContactPerson,
                //    ContactNo = customerViewModelDto.MobNo,
                //    MobNo = customerViewModelDto.MobNo,
                //    WhatsAppNo = customerViewModelDto.WhatsAppNo,
                //    Email = customerViewModelDto.Email,
                //    PANNo = customerViewModelDto.PANNo,
                //    GSTNo = customerViewModelDto.GSTNo,
                //    LegalName = customerViewModelDto.LegalName,
                //    TradeName = customerViewModelDto.TradeName,
                //    TypeOfBusiness = customerViewModelDto.TypeOfBusiness,
                //    AadharVerified = customerViewModelDto.AadharVerified,
                //    GSTStatus = customerViewModelDto.GSTStatus,
                //    GSTVarifiedOn = customerViewModelDto.GSTVarifiedOn,
                //    PANStatus = customerViewModelDto.PANStatus,
                //    PANLinkedWithAdhar = customerViewModelDto.PANLinkedWithAdhar,
                //    PANVerifiedOn = customerViewModelDto.PANVerifiedOn,
                customerViewModelDto.CompanyId = Convert.ToInt32(companyId);
                customerViewModelDto.CreatedBy = Convert.ToInt32(profileId);
                customerViewModelDto.UpdatedBy = Convert.ToInt32(profileId);
                //    //UpdatedOn = DateTime.Now
                //};
                var result = await _customerServices.EditCustomer(partyId, customerViewModelDto);
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


        [HttpGet]
        public async Task<IActionResult> GetGstKycDetails()
        {
            try
            {
                var details = await _customerServices.GetGstKycDetails();
                return Ok(details);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPanKycDetails()
        {
            try
            {
                var details = await _customerServices.GetPanKycDetails();
                return Ok(details);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }
    }
}
