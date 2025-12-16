using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class ProductService : IProductService
    {
        private readonly IProductAdaptor _productAdaptor;
        public ProductService(IProductAdaptor productAdaptor)
        {
            _productAdaptor = productAdaptor;
        }
        public Task<bool> AddProduct(ProductRequestDto productRequestDto)
        {
            return _productAdaptor.AddProduct(productRequestDto);
        }

        public Task<string> DeleteProduct(int productId)
        {
            return _productAdaptor.DeleteProduct(productId);
        }

        public Task<bool> EditProduct(int productId, ProductRequestDto productRequestDto)
        {
            return _productAdaptor.EditProduct(productId, productRequestDto);
        }

        public Task<PageList<ProductResponseDto>> GetAllProducts(PagingParam pagingParam)
        {
            return _productAdaptor.GetAllProducts(pagingParam);
        }
        public Task<IEnumerable<ProductResponseDto>> GetDrpProductList(int companyId)
        {
            return _productAdaptor.GetDrpProductList(companyId);
        }
    }
}
