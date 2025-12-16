using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IProductService
    {
        Task<PageList<ProductResponseDto>> GetAllProducts(PagingParam pagingParam);
        Task<bool> AddProduct(ProductRequestDto productRequestDto);
        Task<bool> EditProduct(int productId, ProductRequestDto productRequestDto);
        Task<string> DeleteProduct(int productId);
        Task<IEnumerable<ProductResponseDto>> GetDrpProductList(int companyId);
    }
}
