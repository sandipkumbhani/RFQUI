using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Controllers
{
    public class DashboardController : BaseController
    {
        private readonly IDashboardServices _dashBoardServices;
        private readonly GlobalClass _globalClass;


        public DashboardController(IDashboardServices dashBoardServices, IMenuServices menuServices, GlobalClass globalClass) : base(menuServices, globalClass)
        {
            _dashBoardServices = dashBoardServices;
            _globalClass = globalClass;
        }
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> Dashboard(CompanyUserResponseDto companyUserResponseDto)
        {
            try
            {
                IList<DashboardCardResponseDto> dashboardCards = await _dashBoardServices.GetDashboardCards();
                ViewBag.DashboardCards = dashboardCards != null ? dashboardCards : new List<DashboardCardResponseDto>();
                await SetMenuAsync();
                return View();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardCardDetails(string cardId)
        {
            try
            {
                var dashboardCardDetails = await _dashBoardServices.GetDashboardCardDetails(cardId);
                return Json(new { data = dashboardCardDetails });
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}