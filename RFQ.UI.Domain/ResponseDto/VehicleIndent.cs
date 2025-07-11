using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class VehicleIndent
    {
        public int IndentId { get; set; }
        public string IndentNo { get; set; }
        public int? BranchId { get; set; }
        public int? CorporateId { get; set; }
        public DateTime? IndentDate { get; set; }
        public DateTime? VehicleRequiredOn { get; set; }
        public int? CustomerId { get; set; }
        public string FromLocation { get; set; }
        public decimal? FromLatitude { get; set; }
        public decimal? FromLongitude { get; set; }
        public string ToLocation { get; set; }
        public decimal? ToLatitude { get; set; }
        public decimal? ToLongitude { get; set; }
        public int? VehicleTypeId { get; set; }
        public int? ItemId { get; set; }
        public int? PackingTypeId { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string Consignor { get; set; }
        public string Consignee { get; set; }
        public int? StatusId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
