using Microsoft.EntityFrameworkCore;
using Infrastructure.Configurations;
using Domain.Entities;

namespace Infrastructure.Shared;

public class EletricGoDbContext : DbContext
{
    public DbSet<Warehouse> Warehouses { get; set; }
    public DbSet<Delivery> Deliveries { get; set; }

    public EletricGoDbContext(DbContextOptions options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("public");
        //TO DO:
        //Add the following for each entity
        modelBuilder.ApplyConfiguration(new WarehouseEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DeliveryEntityTypeConfiguration());
    }
}