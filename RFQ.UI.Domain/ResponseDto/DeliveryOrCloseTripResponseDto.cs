using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class DeliveryOrCloseTripResponseDto
    {
        public int DeliveryId { get; set; }
        public string DeliveryNo { get; set; }
        public int CompanyId { get; set; }
        public int LocationId { get; set; }
        public string LocationName { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int BookingId { get; set; }
        public string BookingNo { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public DateTime UnloadDateTime { get; set; }
        public int DeliveredPackets { get; set; }
        public int DeliveredWeight { get; set; }
        public string Signature { get; set; }
        public int LinkId { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
