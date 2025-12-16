using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class ProductController : BaseController
    {
        private readonly IProductService _productService;
        private readonly GlobalClass _globalClass;
        public ProductController(IProductService productService, GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _productService = productService;
            _globalClass = globalClass;
        }
        public async Task<ActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ProductSave([FromBody] ProductRequestDto productRequestDto)
        {
            try
            {
                if (productRequestDto == null)
                {
                    throw new ArgumentNullException(nameof(productRequestDto), "Item data is null");
                }
                else
                {
                    productRequestDto.CompanyId = _globalClass.CompanyId;
                    productRequestDto.CreatedBy = _globalClass.UserId;
                    productRequestDto.UpdatedBy = _globalClass.UserId;
                    productRequestDto.CreatedOn = DateTime.Now;
                    productRequestDto.UpdatedOn = DateTime.Now;
                    productRequestDto.StatusId = (int)EStatus.IsActive;

                    var result = await _productService.AddProduct(productRequestDto);
                    return Json(result);
                }
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                if (innerMessage.Contains("UNIQUE") || innerMessage.Contains("duplicate") || innerMessage.Contains("409"))
                {
                    return Conflict($"Item already exists.");
                }
                else
                    throw new Exception("Failed to Add Item Details");
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditProduct([FromBody] ProductRequestDto productRequestDto)
        {
            try
            {
                int productId = productRequestDto.ItemId;
                productRequestDto.CompanyId = _globalClass.CompanyId;
                productRequestDto.CreatedBy = _globalClass.UserId;
                productRequestDto.UpdatedBy = _globalClass.UserId;
                productRequestDto.CreatedOn = DateTime.Now;
                productRequestDto.UpdatedOn = DateTime.Now;

                var result = await _productService.EditProduct(productId, productRequestDto);
                return Json(result);
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                if (innerMessage.Contains("UNIQUE") || innerMessage.Contains("duplicate") || innerMessage.Contains("409"))
                {
                    return Conflict($"Item already exists.");
                }
                else
                    throw new Exception("Failed to Update Item Details");
            }
        }

        [HttpDelete("Product/DeleteProduct/{productId}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            try
            {
                var result = await _productService.DeleteProduct(productId);
                if (result != null)
                    return Json(new { result = "Success" });
                else
                    return Json(new { result = "Failed" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetAllProducts([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _productService.GetAllProducts(pagingParam);
                if (Request.IsAjaxRequest())
                {
                    return Json(new
                    {
                        draw = result.PageNumber,
                        recordsTotal = result.TotalRecordCount,
                        recordsFiltered = result.TotalRecordCount,
                        displayColumn = result.DisplayColumns,
                        data = result.Result
                    });
                }
                else
                {
                    return View(result);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        
        public async Task<IActionResult> GetDrpProductList([FromQuery] int companyId)
        {
            try
            {
                var result = await _productService.GetDrpProductList(companyId);
                if (Request.IsAjaxRequest())
                    return Json(result);
                else
                    return View(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}