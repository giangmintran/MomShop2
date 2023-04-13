using Microsoft.AspNetCore.Mvc;
using MOMShop.Utils;

namespace MOMShop.Dto.ReceivedOrder
{
    public class FilterReceiveOrderDto : PagingBase
    {
        [FromQuery(Name = "status")]
        public int? Status { get; set; }
    }
}
