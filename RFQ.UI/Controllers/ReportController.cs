using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Controllers
{
    public class ReportController : BaseController
    {
        private readonly IReportService _reportService;
        public ReportController(IMenuServices menuServices, GlobalClass globalClass, IReportService reportService) : base(menuServices, globalClass)
        {
            _reportService = reportService;
        }

        public async Task<IActionResult> ReportDetails()
        {
            await SetMenuAsync();
            string? linkId = Request.Query["LinkId"];
            int linkItemId = !string.IsNullOrEmpty(linkId) ? int.Parse(linkId) : 0;
            ViewBag.LinkId = linkItemId;
            var menuList = (IList<MenulistModel>?)ViewData["menulist"];
            var currentMenu = menuList?.FirstOrDefault(x => x.LinkId == linkItemId);
            ViewBag.ReportName = currentMenu != null ? currentMenu.LinkName : "";
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetReportDetails([FromBody] ReportRequestDto requestDto)
        {
            try
            {
                var result = await _reportService.GetReportDetails(requestDto);
                return Json(new { Data = result, Success = true ,Message = "" });
            }
            catch (Exception ex)
            {
                return Json(new { Data = "", Success = false , Message = ex .Message});
            }
        }
    }
}
