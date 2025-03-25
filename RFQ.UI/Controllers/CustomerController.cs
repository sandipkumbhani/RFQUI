using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;
using static RFQ.UI.Domain.Model.CustomerViewModel;

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
        public IActionResult CustomerSave([FromBody] CustomerViewModelDto customerViewModelDto)
        {
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
            string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
            string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

            if (customerViewModelDto != null)
            {
                var Customer = new CustomerViewModelDto()
                {
                    CompanyId = Convert.ToInt32(companyid),
                    PartyTypeId = customerViewModelDto.PartyTypeId,
                    PartyName = customerViewModelDto.PartyName,
                    PartyCategoryId = customerViewModelDto.PartyCategoryId,
                    AddressLine = customerViewModelDto.AddressLine,
                    CityId = customerViewModelDto.CityId,
                    PinCode = customerViewModelDto.PinCode,
                    ContactPerson = customerViewModelDto.ContactPerson,
                    ContactNo = customerViewModelDto.ContactNo,
                    MobNo = customerViewModelDto.MobNo,
                    WhatsAppNo = customerViewModelDto.WhatsAppNo,
                    Email = customerViewModelDto.Email,
                    PANNo = customerViewModelDto.PANNo,
                    GSTNo = customerViewModelDto.GSTNo,
                    LegalName = customerViewModelDto.LegalName,
                    TradeName = customerViewModelDto.TradeName,
                    TypeOfBusiness = customerViewModelDto.TypeOfBusiness,
                    AadharVerified = customerViewModelDto.AadharVerified,
                    GSTStatus = customerViewModelDto.GSTStatus,
                    GSTVarifiedOn = customerViewModelDto.GSTVarifiedOn,
                    PANStatus = customerViewModelDto.PANStatus,
                    PANLinkedWithAdhar = customerViewModelDto.PANLinkedWithAdhar,
                    PANVerifiedOn = customerViewModelDto.PANVerifiedOn,
                    CreatedBy = Convert.ToInt32(profileid),
                    //CreatedOn = DateTime.UtcNow,
                    UpdatedBy = Convert.ToInt32(profileid)
                };
                var result = _customerServices.AddCustomer(Customer);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });

            }
        }

        [HttpGet]
        public async Task<IActionResult> ViewCustomer(CustomerViewModel customerViewModel)
        {
            try
            {
                customerViewModel ??= new CustomerViewModel();
                var userlist = await _customerServices.GetAllCustomer();
                if (userlist != null && userlist.Count() > 0)
                {
                    customerViewModel.customerViewModelDtos.AddRange(userlist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(customerViewModel);
                }
                else
                {
                    return View(customerViewModel);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCustomer([FromBody] CustomerViewModelDto customerViewModelDto)
        {
            try
            {
                if (customerViewModelDto.PartyId <= 0)
                {
                    return Json(new { result = "error", message = "Invalid PartyId." });
                }
                int partyId = customerViewModelDto.PartyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                var customer = new CustomerViewModelDto
                {
                    PartyName = customerViewModelDto.PartyName,
                    AddressLine = customerViewModelDto.AddressLine,
                    CityId = customerViewModelDto.CityId,
                    PinCode = customerViewModelDto.PinCode,
                    ContactPerson = customerViewModelDto.ContactPerson,
                    ContactNo = customerViewModelDto.MobNo,
                    MobNo = customerViewModelDto.MobNo,
                    WhatsAppNo = customerViewModelDto.WhatsAppNo,
                    Email = customerViewModelDto.Email,
                    PANNo = customerViewModelDto.PANNo,
                    GSTNo = customerViewModelDto.GSTNo,
                    LegalName = customerViewModelDto.LegalName,
                    TradeName = customerViewModelDto.TradeName,
                    TypeOfBusiness = customerViewModelDto.TypeOfBusiness,
                    AadharVerified = customerViewModelDto.AadharVerified,
                    GSTStatus = customerViewModelDto.GSTStatus,
                    GSTVarifiedOn = customerViewModelDto.GSTVarifiedOn,
                    PANStatus = customerViewModelDto.PANStatus,
                    PANLinkedWithAdhar = customerViewModelDto.PANLinkedWithAdhar,
                    PANVerifiedOn = customerViewModelDto.PANVerifiedOn,
                    CompanyId = Convert.ToInt32(companyid),
                    CreatedBy = Convert.ToInt32(profileid),
                    UpdatedBy = Convert.ToInt32(profileid),
                    //UpdatedOn = DateTime.Now
                };
                var result = await _customerServices.EditCustomer(partyId, customer);
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
