using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Controllers
{
    public class DashboardController : Controller
    {
        private readonly IDashboardServices _dashBoardServices;

        public DashboardController(IDashboardServices dashBoardServices)
        {
            _dashBoardServices = dashBoardServices;

        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Dashboard(DashboardViewModel dashboardViewModel)
        {
            try
            {
                var userlist = await _dashBoardServices.GetAllUsers();
                if (userlist != null && userlist.Count() > 0)
                {
                    dashboardViewModel.CompanyUserDto.AddRange(userlist);
                }
                return View(dashboardViewModel);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}