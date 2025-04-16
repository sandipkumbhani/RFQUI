using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class ProfileController : Controller
    {

        private readonly IProfileServices _profileServices;

        public ProfileController(IProfileServices profileServices)
        {
            _profileServices = profileServices;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Profile()
        {
            return View();
        }
        public IActionResult ProfileRight()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Profilesave([FromBody] ProfileRequestDto profileRequestDto)
        {
            if (profileRequestDto != null)
            {
                var profile = new ProfileRequestDto()
                {
                    ProfileName = profileRequestDto.ProfileName,
                    CompanyTypeId = profileRequestDto.CompanyTypeId,
                };
                var result = _profileServices.AddProfile(profile);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });

            }
        }
        public async Task<IActionResult> ViewProfile()
        {
            try
            {
                var profilelist = await _profileServices.GetProfileAll();

                if (Request.IsAjaxRequest())
                {
                    return Json(profilelist);
                }
                else
                {
                    return Json(profilelist);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<IActionResult> GetAllApplicableList()
        {
            try
            {
                var alllist = await _profileServices.GetAllApplicableList();
                if (alllist != null && alllist.Count() > 0)
                {
                    return Json(alllist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(alllist);
                }
                else
                {
                    return View(alllist);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
        public async Task<IActionResult> GetAllMenuGroup()
        {
            try
            {
                var alllist = await _profileServices.GetAllMenuGroup();
                if (alllist != null && alllist.Count() > 0)
                {
                    return Json(alllist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(alllist);
                }
                else
                {
                    return View(alllist);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
        public async Task<IActionResult> GetLinkItemList()
        {
            try
            {
                var alllist = await _profileServices.GetLinkItemList();
                if (alllist != null && alllist.Count() > 0)
                {
                    return Json(alllist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(alllist);
                }
                else
                {
                    return View(alllist);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        public async Task<IActionResult> GetProfileRightsByProfileId(int id)
        {
            try
            {
                var alllist = await _profileServices.GetProfileRightsByProfileId(id);
                if (alllist != null && alllist.Count() > 0)
                {
                    return Json(alllist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(alllist);
                }
                else
                {
                    return View(alllist);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
    }
}
