using AutoMapper;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.MapperProfile
{
    public class AutoMappersRegister : Profile
    {
        public AutoMappersRegister()
        {
            CreateMap<object, CorporateCompanyRequestDto>();
            CreateMap<object, DriverRequestDto>();
        }
    }
}
