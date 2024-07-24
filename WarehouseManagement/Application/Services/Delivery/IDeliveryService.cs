using Application.DTOs;

namespace Application.Services;

public interface IDeliveryService
{
    public Task<List<DeliveryDTO>> GetAllAsync();
    public Task<DeliveryWithWarehouseDTO> GetByCodeAsync(string code);
    public Task<DeliveryDTO> AddAsync(CreateDeliveryDTO dto);
    public Task<DeliveryDTO> UpdateAsync(string id, UpdateDeliveryDTO dto);
}