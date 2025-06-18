using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IProductService
    {
        Task<PageList<ProductResponseDto>> GetAllProducts(PagingParam pagingParam);
        Task<string> AddProduct(ProductRequestDto productRequestDto);
        Task<string> EditProduct(int productId, ProductRequestDto productRequestDto);
        Task<string> DeleteProduct(int productId);
    }
}
