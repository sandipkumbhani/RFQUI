using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class MasterPartyRouteController : BaseController
    {
        private readonly IMasterPartyRouteService _masterPartyRouteService;
        private readonly GlobalClass _globalClass;
        public MasterPartyRouteController(IMasterPartyRouteService masterPartyRouteService, GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _masterPartyRouteService = masterPartyRouteService;
            _globalClass = globalClass;
        }

        [HttpGet("MasterPartyRoute/GetMasterPartyRouteByPartyId/{partyId}")]
        public async Task<IActionResult> GetMasterPartyRouteByPartyId(int partyId)
        {
            try
            {
                var routeList = await _masterPartyRouteService.GetMasterPartyRouteByPartyId(partyId);
                if (Request.IsAjaxRequest())
                    return Json(routeList);
                else
                    return View(routeList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpDelete("MasterPartyRoute/DeleteMasterPartyRouteById/{partyRouteId}")]
        public async Task<IActionResult> DeleteMasterPartyRouteById(int partyRouteId)
        {
            try
            {
                var result = await _masterPartyRouteService.DeleteMasterPartyRouteById(partyRouteId);
                if (Request.IsAjaxRequest())
                {
                    return Json(result);
                }
                return View(result);
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
