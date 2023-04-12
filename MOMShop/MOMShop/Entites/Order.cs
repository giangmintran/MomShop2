using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace MOMShop.Entites
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        public string OrderCode { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        /// <summary>
        /// Ngày đặt
        /// </summary>
        [Comment("Ngay tao don")]
        public DateTime CreatedDate { get; set; }
        /// <summary>
        /// Thời gian nhận hàng dự kiến
        /// </summary>
        [Comment("Thoi gian nhan hang du kien")]
        public DateTime IntendedTime { get; set; }
        public int PaymentType { get; set; }
        [Comment("1. Khoi tao, 2.Da nhan, 3. Da giao, 4. Da xoa")]
        public int OrderStatus { get; set; }
        public float TotalAmount { get; set; }
        public bool Deleted { get; set; }
    }
}
