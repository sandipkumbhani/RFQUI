using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class VendorController : BaseController
    {
        private readonly IVendorService _vendorService;
        private readonly GlobalClass _globalClass;
        private readonly IMenuServices _menuServices;
        public VendorController(IVendorService vendorService, GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _vendorService = vendorService;
            _globalClass = globalClass;
            _menuServices = menuServices;
        }
        public async Task<ActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }

        public async Task<ActionResult> VendorRating()
        {
            await SetMenuAsync();
            return View();
        }
        public async Task<ActionResult> VendorRequest()
        {
            await SetMenuAsync();
            return View();
        }
        public async Task<ActionResult> QuoteRoleVendor()
        {
            await SetMenuAsync();
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
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                if (vendorRequestDto != null)
                {
                    vendorRequestDto.CompanyId = Convert.ToInt32(companyId);
                    vendorRequestDto.CreatedBy = Convert.ToInt32(userid);
                    vendorRequestDto.UpdatedBy = Convert.ToInt32(userid);
                    vendorRequestDto.PartyTypeId = (int)EnumInternalMaster.VENDOR;

                    var response = await _vendorService.AddVendor(vendorRequestDto);
                    return Ok(response);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> GetAllVendor([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _vendorService.GetAllVendor(pagingParam);
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
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                vendorRequestDto.CompanyId = Convert.ToInt32(companyId);
                vendorRequestDto.CreatedBy = Convert.ToInt32(userid);
                vendorRequestDto.UpdatedBy = Convert.ToInt32(userid);
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

        [HttpGet]
        public async Task<IActionResult> GetAllVendorList([FromQuery]int companyId)
        {
            try
            {
                var vendorList = await _vendorService.GetAllVendorList(companyId);

                if (Request.IsAjaxRequest())
                {
                    return Json(vendorList);
                }
                else
                {
                    return View(vendorList);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
