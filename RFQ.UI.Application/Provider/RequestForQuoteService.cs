using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class RequestForQuoteService : IRequestForQuoteService
    {
        private readonly IRequestForQuoteAdaptor _requestForQuoteAdaptor; 
        public RequestForQuoteService(IRequestForQuoteAdaptor requestForQuoteAdaptor)
        {
            _requestForQuoteAdaptor = requestForQuoteAdaptor;
        }
        public Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList()
        {
            return _requestForQuoteAdaptor.GetAllVehicleIndentList();
        }
    }
}
