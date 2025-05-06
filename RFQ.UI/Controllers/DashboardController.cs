using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;

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

        public async Task<IActionResult> Dashboard(CompanyUserResponseDto companyUserResponseDto)
        {
            try
            {
               
                if (Request.IsAjaxRequest())
                {
                    var userlist = await _dashBoardServices.GetAllUsers();
                    if (userlist != null && userlist.Count() > 0)
                    {
                        companyUserResponseDto.responseDto.AddRange(userlist);
                    }
                    return Json(userlist);
                }
                return View();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}