using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.Model
{
    public class GetCompanyAndFranchiseModel
    {
        public GetCompanyAndFranchiseModel()
        {
            getCompanyAndFranchiseModelDtos = new List<GetCompanyAndFranchiseModelDto>();
        }
        public List<GetCompanyAndFranchiseModelDto> getCompanyAndFranchiseModelDtos { get; set; }
        public class GetCompanyAndFranchiseModelDto
        {
            public int CompanyId { get; set; }
            public string? CompanyName { get; set; }
           // public int CompanyTypeId { get; set; }
        }
    }
}
