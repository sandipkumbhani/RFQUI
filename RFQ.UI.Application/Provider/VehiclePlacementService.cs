using Microsoft.AspNetCore.Mvc;
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
    public class VehiclePlacementService : IVehiclePlacementService
    {
        private readonly IVehiclePlacementAdaptor _vehiclePlacementAdaptor;

        public VehiclePlacementService(IVehiclePlacementAdaptor vehiclePlacementAdaptor)
        {
            _vehiclePlacementAdaptor = vehiclePlacementAdaptor;
        }

        public Task<VehiclePlacementRequestDto?> AddVehiclePlacement(VehiclePlacementRequestDto vehiclePlacementRequestDto)
        {
            return _vehiclePlacementAdaptor.AddVehiclePlacement(vehiclePlacementRequestDto);
        }

        public async Task<IEnumerable<AutoFetchIndentResponseDto>> AutoFetchPlacement(int id)
        {
            return await _vehiclePlacementAdaptor.AutoFetchPlacement(id);
        }

        public async Task<string> DeleteVehiclePlacement(int placementId)
        {
            return await _vehiclePlacementAdaptor.DeleteVehiclePlacement(placementId);
        }

        public async Task<PageList<VehiclePlacementResponseDto>> GetAllVehiclePlacement(PagingParam pagingParam)
        {
            return await _vehiclePlacementAdaptor.GetAllVehiclePlacement(pagingParam);
        }

        public Task<IEnumerable<VehiclePlacementResponseDto>> GetAllVehiclePlacementNo(int companyId)
        {
            return _vehiclePlacementAdaptor.GetAllVehiclePlacementNo(companyId);
        }

        public Task<string> GetPlacementNo()
        {
            return _vehiclePlacementAdaptor.GetPlacementNo();
        }

        public async Task<string> UpdateVehiclePlacement(int placementId, VehiclePlacementRequestDto vehiclePlacementRequestDto)
        {
            return await _vehiclePlacementAdaptor.UpdateVehiclePlacement(placementId, vehiclePlacementRequestDto);
        }
        public async Task<bool> CheckVehicleAndIndentUnique(int vehicleId, int indentId)
        {
            return await _vehiclePlacementAdaptor.CheckVehicleAndIndentUnique(vehicleId, indentId);
        }
        public async Task<IEnumerable<AwardedIndentListResponseDto>> GetAwardedIndentList(int companyId)
        {
            return await _vehiclePlacementAdaptor.GetAwardedIndentList(companyId);
        }
        public async Task<int> GetVehiclePlacementCountByIndentNo(int indentId)
        {
            return await _vehiclePlacementAdaptor.GetVehiclePlacementCountByIndentNo(indentId);
        }
        public async Task<bool> CheckAwardedVendor(CheckAwardedVendorRequestDto requestDto)
        {
            return await _vehiclePlacementAdaptor.CheckAwardedVendor(requestDto);
        }
    }
}
