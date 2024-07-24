using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Application.Persistence;
using Infrastructure.Shared;
using Infrastructure.Repositories;
using Application.Persistence.Repositories;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Configuration;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Database");

        Console.Write(connectionString);

        services.AddDbContext<EletricGoDbContext>(
            opt => opt.UseNpgsql(connectionString)
                       .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());

        services.AddTransient<IUnitOfWork, UnitOfWork>();

        services.AddTransient<IWarehouseRepository, WarehouseRepository>();
        services.AddTransient<IDeliveryRepository, DeliveryRepository>();

        return services;
    }
}