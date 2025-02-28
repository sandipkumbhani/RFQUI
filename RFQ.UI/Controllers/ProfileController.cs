using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Model;
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

        [HttpPost]
        public IActionResult Profilesave([FromBody] ProfileViewModelDto profileViewModelDto)
        {
            if (profileViewModelDto != null)
            {
                var profile = new ProfileViewModelDto()
                {
                    ProfileName = profileViewModelDto.ProfileName,
                    CompanyTypeId = profileViewModelDto.CompanyTypeId,
                };
                var result = _profileServices.AddProfile(profile);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });

            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileViewModelDto profileViewModelDto)
        {
            try
            {
                int profileId = profileViewModelDto.ProfileId;
                var result = await _profileServices.EditProfile(profileId, profileViewModelDto);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [Route("Home/DeleteProfile/{profileId}")]
        [HttpDelete("{profileId}")]
        public async Task<IActionResult> DeleteProfile(int profileId)
        {
            try
            {
                var result = await _profileServices.DeleteProfile(profileId);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
        public async Task<IActionResult> ViewProfile(ProfileViewModel profileViewModel)
        {
            try
            {
                profileViewModel ??= new ProfileViewModel();
                var userlist = await _profileServices.GetProfileAll();
                if (userlist != null && userlist.Count() > 0)
                {
                    profileViewModel.profileViewModelDtos.AddRange(userlist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(profileViewModel); // Return JSON for AJAX requests
                }
                else
                {
                    return View(profileViewModel); // Return the view for normal requests
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public IActionResult ProfileRight()
        {
            return View();
        }

    }
}
