﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static RFQ.UI.Domain.Model.VehicleTypeViewModel;

namespace RFQ.UI.Application.Inteface
{
    public interface IVehicletypeServices
    {
        Task<string> AddVehicleType(VehicleTypeViewModelDto vehicleTypeViewModelDto);

        Task<IEnumerable<VehicleTypeViewModelDto>> GetVehicleTypeAll();

        Task<string> EditVehicleType(int vehicleTypeId, VehicleTypeViewModelDto vehicleTypeViewModelDto);

        Task<string> DeleteVehicleType(int vehicleTypeId);
    }
}
