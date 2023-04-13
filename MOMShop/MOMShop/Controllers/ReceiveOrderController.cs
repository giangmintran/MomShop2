using Microsoft.AspNetCore.Mvc;
using MOMShop.Dto.Product;
using MOMShop.Dto.ReceivedOrder;
using MOMShop.Services.Interfaces;
using MOMShop.Utils;
using System;

namespace MOMShop.Controllers
{
    [Route("api/receive-order")]
    [ApiController]
    public class ReceiveOrderController : BaseController
    {
        private IReceiveOrderServices _services;
        public ReceiveOrderController(IReceiveOrderServices services)
        {
            _services = services;
        }

        [HttpGet("find-all")]
        public APIResponse GetProducts([FromQuery] FilterReceiveOrderDto input)
        {
            try
            {
                var result = _services.GetReceiveOrders(input);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpPost("add")]
        public APIResponse AddReceiveOrder([FromBody] CreateReceiveOrderDto input)
        {
            try
            {
                var result = _services.AddReceiveOrder(input);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpGet("find-by-id/{id}")]
        public APIResponse FindById(int id)
        {
            try
            {
                var result = _services.FindById(id);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

    }

}
