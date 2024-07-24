using Infrastructure.Repositories;
using Application.Services;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using Xunit;
using API.Controllers;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Domain.Entities;

namespace Tests.API
{
[Trait("Category", "Unit")]
public class DeliveryControllerTest
{

    private readonly EletricGoDbContext context;
    private readonly DeliveryController controller;
    private readonly List<Warehouse> warehouses;
    private readonly List<Delivery> deliveries;

    public DeliveryControllerTest()
    {
        var _contextOptions = new DbContextOptionsBuilder<EletricGoDbContext>()
                                  .UseInMemoryDatabase("Tests")
                                  .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>()
                                  .Options;

        context = new EletricGoDbContext(_contextOptions);

        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        var deliveryRepository = new DeliveryRepository(context);
        var warehouseRepository = new WarehouseRepository(context);
        var unitOfWork = new UnitOfWork(context);
        var service = new DeliveryService(unitOfWork, deliveryRepository, warehouseRepository);
        controller = new DeliveryController(service);

        warehouses = new List<Warehouse>() {
            new Warehouse(new WarehouseEnabled(true), new WarehouseCode("ABC"), new WarehouseDescription("desc"),
                          new WarehouseAddress("my-cool-street", "4000-100", "city", "country"),
                          new WarehouseCoordinates(8, 8)),
            new Warehouse(new WarehouseEnabled(true), new WarehouseCode("DEF"), new WarehouseDescription("desc"),
                          new WarehouseAddress("my-cool-street", "4000-100", "city", "country"),
                          new WarehouseCoordinates(8, 8)),
        };

        deliveries = new List<Delivery>() {
            new Delivery(new DeliveryCode("codA"), DateTime.Now, 10, 10, 10, new WarehouseId(warehouses.First().Id.AsGuid())),
            new Delivery(new DeliveryCode("codB"), DateTime.Now, 10, 10, 10, new WarehouseId(warehouses.First().Id.AsGuid()))
        };

        context.AddRange(warehouses);
        context.AddRange(deliveries);

        context.SaveChanges();
    }

    [Fact(DisplayName = "Should list Delivery - list all")]
    public async void ShouldListDeliveryAll()
    {
        var result = await controller.GetAll();

        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var resultDTO = Assert.IsType<List<DeliveryDTO>>(actionResult.Value);
        Assert.Equal(2, resultDTO.Count);
    }

    [Fact(DisplayName = "Should list Delivery - by code")]
    public async void ShouldListDeliveryByCode()
    {
        var result = await controller.GetByCode(deliveries.First().Code.Value);

        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var resultDTO = Assert.IsType<DeliveryWithWarehouseDTO>(actionResult.Value);
        Assert.NotNull(resultDTO);
    }

    [Fact(DisplayName = "Should list Delivery - by code fail not found")]
    public async void ShouldListDeliveryByCodeNotFound()
    {
        var result = await controller.GetByCode("inex");

        var actionResult = Assert.IsType<NotFoundResult>(result.Result);
    }
}
}
