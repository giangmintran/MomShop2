using Microsoft.EntityFrameworkCore.Migrations;

namespace MOMShop.Migrations
{
    public partial class updateReceiveOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "ProductDetails");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ReceiveOrders",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "ReceiveOrders");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "ProductDetails",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
