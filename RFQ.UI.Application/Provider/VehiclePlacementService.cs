using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
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

        public Task<string> GetPlacementNo()
        {
            return _vehiclePlacementAdaptor.GetPlacementNo();
        }
    }
}
