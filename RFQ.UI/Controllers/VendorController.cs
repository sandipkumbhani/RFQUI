using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class VendorController : Controller
    {
        private readonly IVendorService _vendorService;
        private readonly GlobalClass _globalClass;
        public VendorController(IVendorService vendorService, GlobalClass globalClass)
        {
            _vendorService = vendorService;
            _globalClass = globalClass;
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult QuoteRoleVendor()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllInternalMaster()
        {
            try
            {
                var internalMasterList = await _vendorService.GetAllInternalMaster();

                if (Request.IsAjaxRequest())
                {
                    return Json(internalMasterList);
                }
                else
                {
                    return View(internalMasterList);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> VendorSave([FromBody] VendorRequestDto vendorRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;

                if (vendorRequestDto != null)
                {
                    vendorRequestDto.CompanyId = Convert.ToInt32(companyId);
                    vendorRequestDto.CreatedBy = Convert.ToInt32(companyId);
                    vendorRequestDto.UpdatedBy = Convert.ToInt32(companyId);
                    vendorRequestDto.PartyTypeId = 5;

                    var result = await _vendorService.AddVendor(vendorRequestDto);
                    return Json(new { result });
                }
                else
                {
                    return Json(new { result = "Failed" });

                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllVendor()
        {
            try
            {
                var vendorList = await _vendorService.GetAllVendor();
                if (vendorList != null && vendorList.Count() > 0)
                {
                    var result = vendorList.Where(x => x.PartyTypeId == 5).ToList();
                    if (Request.IsAjaxRequest())
                    {
                        return Json(result);
                    }
                    else
                    {
                        return View(result);
                    }
                }
                return Json(vendorList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [HttpPut]
        public async Task<IActionResult> UpdateVendor([FromBody] VendorRequestDto vendorRequestDto)
        {
            try
            {
                if (vendorRequestDto.PartyId <= 0)
                {
                    return Json(new { result = "error", message = "Invalid PartyId." });
                }
                int partyId = vendorRequestDto.PartyId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                vendorRequestDto.CompanyId = Convert.ToInt32(companyId);
                vendorRequestDto.CreatedBy = Convert.ToInt32(companyId);
                vendorRequestDto.UpdatedBy = Convert.ToInt32(companyId);
                vendorRequestDto.PartyTypeId = 5;
                var result = _vendorService.EditVendor(partyId, vendorRequestDto);
                if (result != null)
                {
                    return Json(new { result = "Success" });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }
        [HttpDelete("Vendor/DeleteVendor/{partyId}")]
        public async Task<IActionResult> DeleteVendor(int partyId)
        {
            try
            {
                var result = await _vendorService.DeleteVendor(partyId);
                if (result != null)
                {
                    return Json(new { result = "Success" });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
    }
}
