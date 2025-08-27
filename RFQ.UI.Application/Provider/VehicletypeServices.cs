using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class VehicleTypeServices : IVehicleTypeServices
    {
        private readonly VehicleTypeAdaptor _vehicleTypeAdaptor;

        public VehicleTypeServices(VehicleTypeAdaptor vehicleTypeAdaptor)
        {
            _vehicleTypeAdaptor = vehicleTypeAdaptor;
        }
        public async Task<NewCommonResponseDto> AddVehicleType(VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            return await _vehicleTypeAdaptor.AddVehicleType(vehicleTypeRequestDto);
        }

        public async Task<string> DeleteVehicleType(int vehicleTypeId)
        {
            return await _vehicleTypeAdaptor.DeleteVehicleType(vehicleTypeId);
        }

        public async Task<string> UpdateVehicleType(int vehicleTypeId, VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            return await _vehicleTypeAdaptor.UpdateVehicleType(vehicleTypeId, vehicleTypeRequestDto);
        }

        public async Task<PageList<VehicleTypeResponseDto>> GetVehicleTypeAll(PagingParam pagingParam)
        {
            return await _vehicleTypeAdaptor.GetAllVehicleType(pagingParam);
        }

        public Task<List<VehicleTypeResponseDto?>> GetAllVehicleTypes()
        {
            return _vehicleTypeAdaptor.GetAllVehicleTypes();
        }
    }
}
