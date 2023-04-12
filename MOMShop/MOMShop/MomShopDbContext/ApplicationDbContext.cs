﻿using Microsoft.EntityFrameworkCore;
using MOMShop.Entites;
using MOMShop.Utils;

namespace MOMShop.MomShopDbContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Collection> Collections { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerContact> CustomerContacts { get; set; }
        public DbSet<CustomerFavourite> CustomerFavourites { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductDetail> ProductDetails { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ReceivedProduct> ReceivedProducts { get; set; }
        public DbSet<ReceiveProductDetail> ReceiveProductDetails { get; set; }
        public DbSet<ReceiveOrder> ReceiveOrders { get; set; }
        public DbSet<ReceiveOrderDetail> ReceiveOrderDetails { get; set; }
        public DbSet<Users> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Collection
            modelBuilder.Entity<Collection>(entity =>
            {
                entity.Property(e => e.Deleted).HasDefaultValue(false);
                entity.Property(e => e.Status).HasDefaultValue(Status.HOAT_DONG);
            });
            #endregion

            #region Customer
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.Property(e => e.Deleted).HasDefaultValue(false);
            });
            #endregion

            #region Customer Contact
            modelBuilder.Entity<CustomerContact>(entity =>
            {
                entity.Property(e => e.Deleted).HasDefaultValue(false);
                entity.Property(e => e.IsDefault).HasDefaultValue(true);
            });
            #endregion

            #region Feedback
            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.Property(e => e.Deleted).HasDefaultValue(false);
            });
            #endregion

            #region Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(e => e.Deleted).HasDefaultValue(false);
                entity.Property(e => e.OrderStatus).HasDefaultValue(OrderStatus.KHOI_TAO);
            });
            #endregion

            #region Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.Deleted).HasDefaultValue(false);
            });
            #endregion

            #region ReceiveOrder
            modelBuilder.Entity<ReceiveOrder>(entity =>
            {
                entity.Property(e => e.Deleted).HasDefaultValue(false);
            });
            #endregion
        }
    }
}
