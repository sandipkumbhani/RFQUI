using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Controllers
{
    public class RfqRecipientController : Controller
    {
        private readonly IRfqRecipientService _rfqRecipientService;
        private readonly GlobalClass _globalClass;
        public RfqRecipientController(IRfqRecipientService rfqRecipientService, GlobalClass globalClass)
        {
            _rfqRecipientService = rfqRecipientService;
            _globalClass = globalClass;
        }

        [HttpPost]
        public async Task<IActionResult> AddRfqRecipient([FromBody] List<RfqRecipientRequestDto> rfqRecipientRequestDtos)
        {
            try
            {
                if (rfqRecipientRequestDtos == null || !rfqRecipientRequestDtos.Any())
                {
                    return BadRequest("No RFQ recipients provided.");
                }
                string result = await _rfqRecipientService.AddRfqRecipient(rfqRecipientRequestDtos);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
