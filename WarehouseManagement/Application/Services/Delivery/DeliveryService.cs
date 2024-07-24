using Application.DTOs;
using Application.Mappers;
using Application.Persistence;
using Application.Persistence.Repositories;
using Domain.Entities;

namespace Application.Services;

public class DeliveryService : BaseService<Delivery, DeliveryId>, IDeliveryService
{

    protected readonly IDeliveryRepository _deliveryRepo;
    protected readonly IWarehouseRepository _warehouseRepo;

    public DeliveryService(IUnitOfWork unitOfWork, IDeliveryRepository deliveryRepository, IWarehouseRepository warehouseRepository) : base(unitOfWork, deliveryRepository)
    {
        this._deliveryRepo = deliveryRepository;
        this._warehouseRepo = warehouseRepository;
    }

    public async Task<List<DeliveryDTO>> GetAllAsync()
    {
        var deliveries = await this._deliveryRepo.GetAllAsyncWithWarehouse();

        return deliveries.ConvertAll<DeliveryDTO>(DeliveryMapper.ToDTO);
    }

    public async Task<DeliveryWithWarehouseDTO> GetByCodeAsync(string code)
    {
        var delivery = await this._deliveryRepo.GetByCodeAsyncWithWarehouse(new DeliveryCode(code));

        if (delivery == null)
            return null;

        return DeliveryMapper.ToDTOWithWarehouse(delivery);
    }

    public async Task<DeliveryDTO> AddAsync(CreateDeliveryDTO input)
    {
        var warehouse = await this._warehouseRepo.GetByCodeAsync(new WarehouseCode(input.DestinationWarehouseCode));

        if (warehouse == null)
            throw new Exception("Warehouse does not exist");

        var delivery = DeliveryMapper.ToDomain(input, warehouse.Id.Value);

        delivery = await this._deliveryRepo.AddAsync(delivery);

        try {
            await this._uow.CommitAsync();
        } catch(Microsoft.EntityFrameworkCore.DbUpdateException ex) {
            throw new Exception("Delivery already exists", ex);
        }

        return DeliveryMapper.ToDTO(delivery);
    }


    public async Task<DeliveryDTO> UpdateAsync(string code, UpdateDeliveryDTO dto)
    {
        var delivery = await this._deliveryRepo.GetByCodeAsyncWithWarehouse(new DeliveryCode(code));

        if (delivery == null)
            return null;

        delivery.Date = dto.Date;
        delivery.Mass = dto.Mass;
        delivery.LoadingTime = dto.LoadingTime;
        delivery.WithdrawingTime = dto.WithdrawingTime;

        await this._uow.CommitAsync();

        return DeliveryMapper.ToDTO(delivery);
    }
}