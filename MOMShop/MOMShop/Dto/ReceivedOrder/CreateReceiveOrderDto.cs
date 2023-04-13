using Microsoft.EntityFrameworkCore;
using System;

namespace MOMShop.Dto.ReceivedOrder
{
    public class CreateReceiveOrderDto
    {
        public string Code { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ReceivedDate { get; set; }
        public string Supplier { get; set; }
        public string Receiver { get; set; }
        public int Status { get; set; }
        public string Description { get; set; }
    }
}
