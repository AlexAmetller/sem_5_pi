using Application.DTOs;
using Application.Mappers;
using Application.Persistence;
using Application.Persistence.Repositories;
using Domain.Entities;

namespace Application.Services;

public class WarehouseService : BaseService<Warehouse, WarehouseId>, IWarehouseService
{

    protected new readonly IWarehouseRepository _repo;

    public WarehouseService(IUnitOfWork unitOfWork, IWarehouseRepository repository) : base(unitOfWork, repository)
    {
        this._repo = repository;
    }

    public async Task<WarehouseDTO> AddAsync(CreateWarehouseDTO dto)
    {
        var warehouse = WarehouseMapper.ToDomain(dto);
        warehouse.Enabled = new WarehouseEnabled(true);
        warehouse = await this._repo.AddAsync(warehouse);

        try {
            await this._uow.CommitAsync();
        } catch(Microsoft.EntityFrameworkCore.DbUpdateException ex) {
            throw new Exception("Warehouse already exists", ex);
        }

        return WarehouseMapper.ToDTO(warehouse);
    }

    public async Task<WarehouseDTO> UpdateAsync(string code, UpdateWarehouseDTO dto)
    {
        var warehouse = await this._repo.GetByCodeAsync(new WarehouseCode(code));

        if (warehouse == null)
            return null;

        // change fields
        warehouse.Description = new WarehouseDescription(dto.Description);
        warehouse.Address =
            new WarehouseAddress(dto.Address.Street, dto.Address.PostalCode, dto.Address.City, dto.Address.Country);
        warehouse.Coordinates = new WarehouseCoordinates(dto.Coordinates.Latitude, dto.Coordinates.Longitude);
        warehouse.Enabled = new WarehouseEnabled(dto.Enabled);

        await this._uow.CommitAsync();

        return WarehouseMapper.ToDTO(warehouse);
    }

    public async Task<List<WarehouseDTO>> GetAllAsync()
    {
        var warehouses = await this._repo.GetAllAsync();

        return warehouses.ConvertAll<WarehouseDTO>(WarehouseMapper.ToDTO);
    }

    public async Task<WarehouseDTO> GetByCodeAsync(string code)
    {
        var warehouse = await this._repo.GetByCodeAsync(new WarehouseCode(code));

        if (warehouse == null)
            return null;

        return WarehouseMapper.ToDTO(warehouse);
    }
}