using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IProductAdaptor
    {
        Task<IEnumerable<ProductResponseDto>> GetAllProducts();
        Task<string> AddProduct(ProductRequestDto productRequestDto);
        Task<string> EditProduct(int productId,ProductRequestDto productRequestDto);
        Task<string> DeleteProduct(int productId);
    }
}
