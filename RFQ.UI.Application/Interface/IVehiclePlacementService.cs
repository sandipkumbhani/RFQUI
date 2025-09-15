using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface IVehiclePlacementService
    {
        Task<string> GetPlacementNo();
        Task<VehiclePlacementRequestDto?> AddVehiclePlacement(VehiclePlacementRequestDto vehiclePlacementRequestDto);
        Task<IEnumerable<AutoFetchIndentResponseDto>> AutoFetchPlacement(int id);
        Task<PageList<VehiclePlacementResponseDto>> GetAllVehiclePlacement(PagingParam pagingParam);
        Task<string> UpdateVehiclePlacement(int placementId, VehiclePlacementRequestDto vehiclePlacementRequestDto);
        Task<string> DeleteVehiclePlacement(int placementId);
    }
}
