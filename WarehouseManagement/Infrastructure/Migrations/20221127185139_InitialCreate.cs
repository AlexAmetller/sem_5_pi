using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "Warehouses",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Code_Value = table.Column<string>(type: "text", nullable: true),
                    Description_Value = table.Column<string>(type: "text", nullable: true),
                    Address_Street = table.Column<string>(type: "text", nullable: true),
                    Address_PostalCode = table.Column<string>(type: "text", nullable: true),
                    Address_City = table.Column<string>(type: "text", nullable: true),
                    Address_Country = table.Column<string>(type: "text", nullable: true),
                    Coordinates_Latitude = table.Column<double>(type: "double precision", nullable: true),
                    Coordinates_Longitude = table.Column<double>(type: "double precision", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Warehouses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Deliveries",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Code_Value = table.Column<string>(type: "text", nullable: true),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Mass = table.Column<double>(type: "double precision", nullable: false),
                    LoadingTime = table.Column<int>(type: "integer", nullable: false),
                    WithdrawingTime = table.Column<int>(type: "integer", nullable: false),
                    DestinationWarehouseId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Deliveries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Deliveries_Warehouses_DestinationWarehouseId",
                        column: x => x.DestinationWarehouseId,
                        principalSchema: "public",
                        principalTable: "Warehouses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Deliveries_Code_Value",
                schema: "public",
                table: "Deliveries",
                column: "Code_Value",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Deliveries_DestinationWarehouseId",
                schema: "public",
                table: "Deliveries",
                column: "DestinationWarehouseId");

            migrationBuilder.CreateIndex(
                name: "IX_Warehouses_Code_Value",
                schema: "public",
                table: "Warehouses",
                column: "Code_Value",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Deliveries",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Warehouses",
                schema: "public");
        }
    }
}
