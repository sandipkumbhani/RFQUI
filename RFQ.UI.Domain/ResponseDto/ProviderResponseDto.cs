using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.ResponseDto
{
    public class ProviderResponseDto
    {
        public int ProviderTypeId { get; set; }
        public string? ProviderName { get; set; }
        public string? ProviderValue { get; set; }
    }
}
