using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDto>> GetAllProducts();
        Task<string> AddProduct(ProductRequestDto productRequestDto);
        Task<string> EditProduct(int productId, ProductRequestDto productRequestDto);
        Task<string> DeleteProduct(int productId);
    }
}
