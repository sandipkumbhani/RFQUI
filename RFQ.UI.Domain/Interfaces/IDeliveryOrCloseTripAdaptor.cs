using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IDeliveryOrCloseTripAdaptor
    {
        Task<string> GenerateDocumentNo();
        Task<DeliveryOrCloseTripRequestDto?> AddDelivery(DeliveryOrCloseTripRequestDto deliveryOrCloseTripRequestDto);
        Task<PageList<DeliveryOrCloseTripResponseDto>> GetAllDelivery(PagingParam pagingParam);
        Task<string> UpdateDelivery(int deliveryId, DeliveryOrCloseTripRequestDto deliveryOrCloseTripRequestDto);
        Task<string> DeleteDelivery(int deliveryId);
    }
}
