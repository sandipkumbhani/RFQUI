using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleAdaptor _vehicleAdaptor;
        public VehicleService(IVehicleAdaptor vehicleAdaptor)
        {
            _vehicleAdaptor = vehicleAdaptor ?? throw new ArgumentNullException(nameof(vehicleAdaptor));
        }
        public async Task<IEnumerable<InternalMasterModel>> GetAllVehicleCategory()
        {
            return await _vehicleAdaptor.GetAllVehicleCategory();
        }
        public async Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto requestDto)
        {
            return await _vehicleAdaptor.GetVehicleKycDetails(requestDto);
        }
        public async Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType()
        {
            return await _vehicleAdaptor.GetAllMasterVehicleType();
        }
        public async Task<IEnumerable<MasterPartyDto>> GetAllOwnerOrVendor()
        {
            return await _vehicleAdaptor.GetAllOwnerOrVendor();
        }

        public async Task<VehicleRequestDto> AddVehicle(VehicleRequestDto vehicleRequestDto)
        {
            return await _vehicleAdaptor.AddVehicle(vehicleRequestDto);
        }

        public Task<IEnumerable<VehicleResponseDto>> GetAllVehicle()
        {
            return _vehicleAdaptor.GetAllVehicle();
        }

        public Task<string> EditVehicle(VehicleRequestDto vehicleRequestDto)
        {
           return _vehicleAdaptor.EditVehicle(vehicleRequestDto);
        }

        public Task<string> DeleteVehicle(int VehicleId)
        {
            return _vehicleAdaptor.DeleteVehicle(VehicleId);
        }
    }
}
