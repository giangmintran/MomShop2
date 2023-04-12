using System.ComponentModel.DataAnnotations;

namespace MOMShop.Entites
{
    public class ReceivedProduct
    {
        [Key]
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int Type { get; set; }
        /// <summary>
        /// Giá nhập
        /// </summary>
        public float Price { get; set; }
        public int Status { get; set; }
        public int Description { get; set; }
    }
}
