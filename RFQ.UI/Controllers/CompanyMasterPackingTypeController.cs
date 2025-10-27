using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class CompanyMasterPackingTypeController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly ICompanyMasterPackingTypeService _companyMasterPackingTypeServices;
        

        public CompanyMasterPackingTypeController(ICompanyMasterPackingTypeService companyMasterPackingTypeServices, GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _companyMasterPackingTypeServices = companyMasterPackingTypeServices;
            _globalClass = globalClass;
        }

        [HttpPost]
        public async Task<IActionResult> AddMasterPackingType([FromBody] CompanyMasterPackingTypeRequestDto companyMasterPackingTypeRequestDto)
        {
            try
            {
                if (companyMasterPackingTypeRequestDto != null)
                {
                    var result = await _companyMasterPackingTypeServices.AddMasterPackingType(companyMasterPackingTypeRequestDto);
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

        [HttpGet]
        public async Task<IActionResult> GetAllMasterPackingType()
        {
            try
            {
                var PackingTypeList = await _companyMasterPackingTypeServices.GetAllMasterPackingType();
                if (Request.IsAjaxRequest())
                    return Json(PackingTypeList);
                else
                    return View(PackingTypeList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
