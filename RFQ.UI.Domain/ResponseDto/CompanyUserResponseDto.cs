namespace RFQ.UI.Domain.ResponseDto
{
    public class CompanyUserResponseDto
    {
        public CompanyUserResponseDto()
        {
            responseDto = new();
        }
        public List<UserResponseDto> responseDto { get; set; }
    }
}
