using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class DeliveryOrCloseTripService : IDeliveryOrCloseTripService
    {
        private readonly IDeliveryOrCloseTripAdaptor _deliveryOrCloseTripAdaptor;

        public DeliveryOrCloseTripService(IDeliveryOrCloseTripAdaptor deliveryOrCloseTripAdaptor)
        {
            _deliveryOrCloseTripAdaptor = deliveryOrCloseTripAdaptor;
        }

        public async Task<DeliveryOrCloseTripRequestDto?> AddDelivery(DeliveryOrCloseTripRequestDto deliveryOrCloseTripRequestDto)
        {
            return await _deliveryOrCloseTripAdaptor.AddDelivery(deliveryOrCloseTripRequestDto);
        }

        public async Task<string> DeleteDelivery(int deliveryId)
        {
            return await _deliveryOrCloseTripAdaptor.DeleteDelivery(deliveryId);
        }

        public Task<string> GenerateDocumentNo()
        {
            return _deliveryOrCloseTripAdaptor.GenerateDocumentNo();
        }

        public async Task<PageList<DeliveryOrCloseTripResponseDto>> GetAllDelivery(PagingParam pagingParam)
        {
            return await _deliveryOrCloseTripAdaptor.GetAllDelivery(pagingParam);
        }

        public async Task<string> UpdateDelivery(int deliveryId, DeliveryOrCloseTripRequestDto deliveryOrCloseTripRequestDto)
        {
            return await _deliveryOrCloseTripAdaptor.UpdateDelivery(deliveryId, deliveryOrCloseTripRequestDto);
        }
    }
}
