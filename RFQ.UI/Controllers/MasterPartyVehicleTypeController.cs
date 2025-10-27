using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class MasterPartyVehicleTypeController : Controller
    {
        private readonly IMasterPartyVehicleTypeService _masterPartyVehicleTypeService;
        public MasterPartyVehicleTypeController(IMasterPartyVehicleTypeService masterPartyVehicleTypeService)
        {
            _masterPartyVehicleTypeService = masterPartyVehicleTypeService;
        }

        [HttpGet("MasterPartyVehicleType/GetMasterPartyVehicleTypeByPartyId/{partyId}")]
        public async Task<IActionResult> GetMasterPartyVehicleTypeByPartyId(int partyId)
        {       
            try { 
                var vehicleTypesList = await _masterPartyVehicleTypeService.GetMasterPartyVehicleTypeByPartyId(partyId);
                if (Request.IsAjaxRequest())
                    return Json(vehicleTypesList);
                else
                    return View(vehicleTypesList);
            }
            catch (Exception ex)
            {
                throw new(ex.Message);
            }
        }

        [HttpDelete("MasterPartyVehicleType/DeleteMasterPartyVehicleTypeById/{partyVehicleTypeId}")]
        public async Task<IActionResult> DeleteMasterPartyVehicleTypeById(int partyVehicleTypeId)
        {
            try
            {
                var result = await _masterPartyVehicleTypeService.DeleteMasterPartyVehicleTypeById(partyVehicleTypeId);
                if (Request.IsAjaxRequest())
                {
                    return Json(result);
                }
                return View(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
