using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.Model
{
    public class VehicleTypeViewModel
    {
        public VehicleTypeViewModel()
        {
            vehicleTypeViewModelDtos = new List<VehicleTypeViewModelDto>();
        }
        public List<VehicleTypeViewModelDto> vehicleTypeViewModelDtos { get; set; }

        public class VehicleTypeViewModelDto
        {
            public int VechicleTypeId { get; set; }
            public int CompanyId { get; set; }
            public string? VehicleTypeName { get; set; }
            public int CreatedBy { get; set; }
            public int UpdatedBy { get; set; }
        }
    }
}
