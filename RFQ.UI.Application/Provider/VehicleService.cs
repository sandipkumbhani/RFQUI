using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
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
        public async Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto vehicleKycRequestDto)
        {
            return await _vehicleAdaptor.GetVehicleKycDetails(vehicleKycRequestDto);
        }
        public async Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType(int companyId)
        {
            return await _vehicleAdaptor.GetAllMasterVehicleType(companyId);
        }
        public async Task<IEnumerable<MasterPartyDto>> GetAllOwnerOrVendor(int companyId)
        {
            return await _vehicleAdaptor.GetAllOwnerOrVendor(companyId);
        }

        public async Task<string> AddVehicle(VehicleRequestDto vehicleRequestDto)
        {
            return await _vehicleAdaptor.AddVehicle(vehicleRequestDto);
        }

        public Task<PageList<VehicleSpResponseDto>> GetAllVehicle(PagingParam pagingParam)
        {
            return _vehicleAdaptor.GetAllVehicle(pagingParam);
        }

        public Task<string> EditVehicle(int vehicleId, VehicleRequestDto vehicleRequestDto)
        {
            return _vehicleAdaptor.EditVehicle(vehicleId, vehicleRequestDto);
        }

        public Task<string> DeleteVehicle(int vehicleId)
        {
            return _vehicleAdaptor.DeleteVehicle(vehicleId);
        }

        public Task<List<VehicleResponseDto?>> GetVehicleNumber()
        {
            return _vehicleAdaptor.GetVehicleNumber();
        }
    }
}
