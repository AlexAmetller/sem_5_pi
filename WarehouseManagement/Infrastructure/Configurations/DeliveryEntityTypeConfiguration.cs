using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

internal class DeliveryEntityTypeConfiguration : IEntityTypeConfiguration<Delivery>
{
    public void Configure(EntityTypeBuilder<Delivery> builder)
    {
        builder.HasKey(b => b.Id);
        builder.OwnsOne(b => b.Code, b =>
            {
                b.HasIndex("Value")
                /* .HasDatabaseName("IX_Delivery_Code_Value") */
                .IsUnique();
            });
        builder.HasOne<Warehouse>(b => b.DestinationWarehouse).WithMany().HasForeignKey(x => x.DestinationWarehouseId);
    }
}