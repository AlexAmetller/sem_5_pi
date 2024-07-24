using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public class DeliveryMapper
{

    public static Delivery ToDomain(CreateDeliveryDTO dto, string warehouseId)
    {
        var code = new DeliveryCode(dto.Code);
        var date = dto.Date;
        var mass = dto.Mass;
        var loadingTime = dto.LoadingTime;
        var withdrawingTime = dto.WithdrawingTime;

        var destinationWarehouseId = new WarehouseId(warehouseId);

        var delivery = new Delivery(code, date, mass, loadingTime, withdrawingTime, destinationWarehouseId, null);

        return delivery;
    }

    public static DeliveryDTO ToDTO(Delivery delivery)
    {
        var dto = new DeliveryDTO(delivery.Code.Value,
                                          delivery.Date,
                                          delivery.Mass,
                                          delivery.LoadingTime,
                                          delivery.WithdrawingTime,
                                          delivery.DestinationWarehouse.Code.Value);

        return dto;
    }

    public static DeliveryWithWarehouseDTO ToDTOWithWarehouse(Delivery delivery)
    {
        var warehouseDTO = WarehouseMapper.ToDTO(delivery.DestinationWarehouse);
        var dto = new DeliveryWithWarehouseDTO(delivery.Code.Value,
                                          delivery.Date,
                                          delivery.Mass,
                                          delivery.LoadingTime,
                                          delivery.WithdrawingTime,
                                          warehouseDTO,
                                          delivery.DestinationWarehouse.Code.Value);
        return dto;
    }
}