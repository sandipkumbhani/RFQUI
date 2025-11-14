using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.Model
{
    public class BookingInvoiceDetail
    {
        public string? InvoiceNo { get; set; }

        public DateTime? InvoiceDate { get; set; }

        public decimal? InvoiceValue { get; set; }

        public string? EwayBillNo { get; set; }

        public DateTime? EwayBillDate { get; set; }

        public DateTime? EwayBillValidUpto { get; set; }
    }
}
