using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public class WarehouseMapper
{

    public static Warehouse ToDomain(CreateWarehouseDTO dto)
    {
        var enabled = new WarehouseEnabled(dto.Enabled);
        var code = new WarehouseCode(dto.Code);
        var description = new WarehouseDescription(dto.Description);
        var address = new WarehouseAddress(
            dto.Address.Street,
            dto.Address.PostalCode,
            dto.Address.City,
            dto.Address.Country);
        var coordinates = new WarehouseCoordinates(
            dto.Coordinates.Latitude,
            dto.Coordinates.Longitude);
        var warehouse = new Warehouse(enabled, code, description, address, coordinates, null);
        return warehouse;
    }

    public static WarehouseDTO ToDTO(Warehouse warehouse)
    {
        var address = new WarehouseAddressDTO(warehouse.Address.Street, warehouse.Address.PostalCode,
                                              warehouse.Address.City, warehouse.Address.Country);
        var coordinates = new WarehouseCoordinatesDTO(warehouse.Coordinates.Latitude, warehouse.Coordinates.Longitude);
        var dto = new WarehouseDTO(warehouse.Enabled.Value, warehouse.Code.Value,
                                    warehouse.Description.Value, address, coordinates);
        return dto;
    }
}