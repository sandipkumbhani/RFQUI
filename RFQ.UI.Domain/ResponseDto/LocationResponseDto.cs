using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class LocationResponseDto
    {
        public int LocationId { get; set; }

        public int CompanyId { get; set; }

        public string? LocationName { get; set; }

        public string? AddressLine { get; set; }

        public int CityId { get; set; }

        public string? PinCode { get; set; }

        public string? ContactPerson { get; set; }

        public string? ContactNo { get; set; }

        public string? MobNo { get; set; }

        public string? WhatsAppNo { get; set; }

        public string Email { get; set; }

        public int LinkId { get; set; }

        public int StatusId { get; set; } = 1;
        public int CreatedBy { get; set; }
       // public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
       // public DateTime UpdatedOn { get; set; }
    }
}
