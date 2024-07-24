using Application.DTOs;

namespace Application.Services;

public interface IWarehouseService
{
    public Task<List<WarehouseDTO>> GetAllAsync();
    public Task<WarehouseDTO> GetByCodeAsync(string code);
    public Task<WarehouseDTO> AddAsync(CreateWarehouseDTO dto);
    public Task<WarehouseDTO> UpdateAsync(string code, UpdateWarehouseDTO dto);
}