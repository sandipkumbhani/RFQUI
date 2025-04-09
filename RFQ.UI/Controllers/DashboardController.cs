using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;

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

        public async Task<IActionResult> Dashboard(CompanyUserResponseDto responseDto)
        {
            try
            {
                List<CompanyUserResponseDto> companyUserList = new();
                var userlist = await _dashBoardServices.GetAllUsers();
                if (userlist != null && userlist.Count() > 0)
                {
                    companyUserList.AddRange(userlist);
                }
                return View(companyUserList);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}