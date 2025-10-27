using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class DashboardController : BaseController
    {
        private readonly IDashboardServices _dashBoardServices;
        private readonly GlobalClass _globalClass;


        public DashboardController(IDashboardServices dashBoardServices, IMenuServices menuServices,GlobalClass globalClass) : base(menuServices, globalClass)
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
                await SetMenuAsync();
                return View();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}