using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

internal class WarehouseEntityTypeConfiguration : IEntityTypeConfiguration<Warehouse>
{
    public void Configure(EntityTypeBuilder<Warehouse> builder)
    {
        builder.HasKey(b => b.Id);
        builder.OwnsOne(b => b.Enabled);
        builder.OwnsOne(b => b.Address);
        builder.OwnsOne(b => b.Coordinates);
        builder.OwnsOne(b => b.Code, b =>
            {
                b.HasIndex("Value")
                /* .HasDatabaseName("IX_Code_Value") */
                .IsUnique();
            });
        builder.OwnsOne(b => b.Description);
    }
}