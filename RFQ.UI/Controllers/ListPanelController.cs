using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using System.ComponentModel;
using System.IdentityModel.Tokens.Jwt;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace RFQ.UI.Controllers
{
    public class ListPanelController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IProfileServices _profileServices;
        public ListPanelController(GlobalClass globalClass, IProfileServices profileServices)
        {
            _globalClass = globalClass;
            _profileServices = profileServices;
        }

        public async Task<IActionResult> Index()
        {
            try
            {

                string IsAdd = string.Empty, IsEdit = string.Empty, IsView = string.Empty, IsCancel = string.Empty;
                string linkItemName = string.Empty,linkAddUrl = string.Empty,linkEditUrl= string.Empty,linkCancelUrl=string.Empty;



                int linkId = !string.IsNullOrEmpty(HttpContext.Request.Query["LinkId"]) ? Convert.ToInt32(HttpContext.Request.Query["LinkId"]) : 0;
                
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                var profileRights = await _profileServices.GetProfileRightsByProfileId(Convert.ToInt32(profileId));
                var linkProfileRights = profileRights.Where(x => x.LinkId == linkId).FirstOrDefault();
                if (linkProfileRights != null)
                {
                    IsAdd = linkProfileRights.IsAdd.ToString();
                    IsEdit = linkProfileRights.IsEdit.ToString();
                    IsView = linkProfileRights.IsView.ToString();
                    IsCancel = linkProfileRights.IsCancel.ToString();
                }

                var linkItem = _profileServices.GetLinkItemList().Result.Where(x=>x.LinkId == linkId).FirstOrDefault();
                if(linkItem != null)
                {
                    linkItemName = linkItem.LinkName;
                    linkAddUrl = linkItem.AddUrl;
                    linkEditUrl = linkItem.EditUrl;
                    linkCancelUrl = linkItem.CancelUrl;
                }

                ViewBag.IsAdd = IsAdd;
                ViewBag.IsEdit = IsEdit;
                ViewBag.IsView = IsView;
                ViewBag.IsCancel = IsCancel;
                ViewBag.linkItemName = linkItemName;
                ViewBag.linkAddUrl = linkAddUrl;
                ViewBag.linkEditUrl = linkEditUrl;
                ViewBag.linkCancelUrl = linkCancelUrl;

                return View("~/Views/Common/ListPanel.cshtml");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
    }
}
