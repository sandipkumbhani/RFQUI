using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IProductAdaptor
    {
        Task<PageList<ProductResponseDto>> GetAllProducts(PagingParam pagingParam);
        Task<NewCommonResponseDto> AddProduct(ProductRequestDto productRequestDto);
        Task<string> EditProduct(int productId, ProductRequestDto productRequestDto);
        Task<string> DeleteProduct(int productId);
        Task<IEnumerable<ProductResponseDto>> GetDrpProductList(int companyId);
    }
}
