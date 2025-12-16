using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public VendorController(IVendorService vendorService, GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _vendorService = vendorService;
            _globalClass = globalClass;
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
                    return Json(internalMasterList);
                else
                    return View(internalMasterList);
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
                if (vendorRequestDto != null)
                {
                    vendorRequestDto.CompanyId = _globalClass.CompanyId;
                    vendorRequestDto.CreatedBy = _globalClass.UserId;
                    vendorRequestDto.UpdatedBy = _globalClass.UserId;
                    vendorRequestDto.PartyTypeId = (int)EnumInternalMaster.VENDOR;
                    vendorRequestDto.StatusId = (int)EStatus.IsActive;
                    var response = await _vendorService.AddVendor(vendorRequestDto);
                    return Ok(response);
                }
                return null;
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                if (innerMessage.Contains("UNIQUE") || innerMessage.Contains("duplicate") || innerMessage.Contains("409"))
                {
                    return Conflict($"Vendor already exists.");
                }
                else
                    throw new Exception("Failed to Add Vendor Details");
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
                vendorRequestDto.CompanyId = _globalClass.CompanyId;
                vendorRequestDto.CreatedBy = _globalClass.UserId;
                vendorRequestDto.UpdatedBy = _globalClass.UserId;
                vendorRequestDto.PartyTypeId = 5;
                var result = await _vendorService.EditVendor(partyId, vendorRequestDto);
                if (result != null)
                    return Json(true);
                else
                    return Json(false);
            }

            catch (Exception ex)
            {
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                if (innerMessage.Contains("UNIQUE") || innerMessage.Contains("duplicate") || innerMessage.Contains("409"))
                {
                    return Conflict($"Vendor already exists.");
                }
                else
                    throw new Exception("Failed to Update Vendor Details");
            }
        }

        [HttpDelete("Vendor/DeleteVendor/{partyId}")]
        public async Task<IActionResult> DeleteVendor(int partyId)
        {
            try
            {
                var result = await _vendorService.DeleteVendor(partyId);
                if (result != null)
                    return Json(new { result = "Success" });
                else
                    return Json(new { result = "Failed" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVendorList([FromQuery] int companyId)
        {
            try
            {
                var vendorList = await _vendorService.GetAllVendorList(companyId);
                if (Request.IsAjaxRequest())
                    return Json(vendorList);
                else
                    return View(vendorList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
