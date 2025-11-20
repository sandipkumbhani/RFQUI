using AutoMapper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.MapperProfile
{
    public class AutoMappersRegister : Profile
    {
        public AutoMappersRegister()
        {
            CreateMap<object, CorporateCompanyRequestDto>();
            CreateMap<object, DriverRequestDto>();
            CreateMap<RfqRecipientResponseDto, RfqRecipientRequestDto>();
            CreateMap<RfqRecipientRequestDto, RfqRecipientResponseDto>();
        }
    }
}
