using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class ProductController : Controller
    {
        private readonly IProductService _productService;
        private readonly GlobalClass _globalClass;
        public ProductController(IProductService productService, GlobalClass globalClass)
        {
            _productService = productService;
            _globalClass = globalClass;
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ProductSave([FromBody] ProductRequestDto productRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;

                if (productRequestDto != null)
                {
                    productRequestDto.CompanyId = Convert.ToInt32(companyId);
                    productRequestDto.CreatedBy = Convert.ToInt32(companyId);
                    productRequestDto.UpdatedBy = Convert.ToInt32(companyId);
                    productRequestDto.CreatedOn = DateTime.Now;
                    productRequestDto.UpdatedOn = DateTime.Now;

                    var result = await _productService.AddProduct(productRequestDto);
                    return Json(new { result = "Success" });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditProduct([FromBody] ProductRequestDto productRequestDto)
        {
            try
            {
                int productId = productRequestDto.ItemId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;

                productRequestDto.CompanyId = Convert.ToInt32(companyId);
                productRequestDto.CreatedBy = Convert.ToInt32(companyId);
                productRequestDto.UpdatedBy = Convert.ToInt32(companyId);
                productRequestDto.CreatedOn = DateTime.Now;
                productRequestDto.UpdatedOn = DateTime.Now;

                var result = await _productService.EditProduct(productId, productRequestDto);
                if (result != null)
                {
                    return Json(new { result = "Success" });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpDelete("Product/DeleteProduct/{productId}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            try
            {
                var result = await _productService.DeleteProduct(productId);
                if (result != null)
                {
                    return Json(new { result = "Success" });
                }
                else
                {
                    return Json(new { result = "Failed" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var productList = await _productService.GetAllProducts();
                if (Request.IsAjaxRequest())
                {
                    return Json(productList);
                }
                else
                {
                    return View(productList);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}