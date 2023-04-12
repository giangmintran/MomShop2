using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace MOMShop.Entites
{
    public class ReceiveOrder
    {
        [Key]
        public int Id { get; set; }
        public string Code { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ReceivedDate { get; set; }
        [Comment("Nguoi gui (Xuong may gui))")]
        public string Supplier { get; set; }
        public string Receiver { get; set; }
        public int Status { get; set; }
        public bool Deleted { get; set; }

    }
}
