using Microsoft.Extensions.DependencyInjection;
using Application.Services;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddTransient<IWarehouseService, WarehouseService>();
        services.AddTransient<IDeliveryService, DeliveryService>();

        return services;
    }
}