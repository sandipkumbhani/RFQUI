using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class VehicleIndentService : IVehicleIndentService
    {
        private readonly IVehicleIndentAdaptor _vehicleIndentAdaptor;
        public VehicleIndentService(IVehicleIndentAdaptor vehicleIndentAdaptor)
        {
            _vehicleIndentAdaptor = vehicleIndentAdaptor;
        }

        public async Task<bool> AddVehicleIndent(VehicleIndentRequestDto vehicleIndentRequestDto)
        {
            return await _vehicleIndentAdaptor.AddVehicleIndent(vehicleIndentRequestDto);
        }

        public async Task<bool> DeleteVehicleIndent(int indentId)
        {
            return await _vehicleIndentAdaptor.DeleteVehicleIndent(indentId);
        }

        public async Task<PageList<VehicleIndentResponseDto>> GetAllVehicleIndent(PagingParam pagingParam)
        {
            return await _vehicleIndentAdaptor.GetAllVehicleIndent(pagingParam);
        }

        public Task<string> GetIndentNo()
        {
            return _vehicleIndentAdaptor.GetIndentNo();
        }

        public Task<string> UpdateVehicleIndent(int indentId, VehicleIndentRequestDto vehicleIndentRequestDto)
        {
            return _vehicleIndentAdaptor.UpdateVehicleIndent(indentId, vehicleIndentRequestDto);
        }
        public async Task<bool> IndentReferenceCheckInRfqAsync(int indentId)
        {
            return await _vehicleIndentAdaptor.IndentReferenceCheckInRfqAsync(indentId);
        }
    }
}
