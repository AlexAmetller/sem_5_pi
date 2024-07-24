using Infrastructure.Repositories;
using Application.Services;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using Xunit;
using API.Controllers;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Tests.API
{
[Trait("Category", "Unit")]
public class WarehouseControllerTest
{

    private readonly EletricGoDbContext context;
    private readonly WarehouseController controller;

    public WarehouseControllerTest()
    {
        var _contextOptions = new DbContextOptionsBuilder<EletricGoDbContext>()
                                  .UseInMemoryDatabase("Tests")
                                  .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>()
                                  .Options;

        context = new EletricGoDbContext(_contextOptions);

        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        var repository = new WarehouseRepository(context);
        var unitOfWork = new UnitOfWork(context);
        var service = new WarehouseService(unitOfWork, repository);
        controller = new WarehouseController(service);
    }

    [Fact(DisplayName = "Should create Warehouse - success")]
    public async void ShouldCreateWarehouseSuccess()
    {
        var addressDTO = new WarehouseAddressDTO("long-name-street", "4000-100", "city", "country");
        var coordinatesDTO = new WarehouseCoordinatesDTO(8, 8);
        var dto = new CreateWarehouseDTO(true, "ABC", "desc", addressDTO, coordinatesDTO);
        var result = await controller.Create(dto);

        var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var resultDTO = Assert.IsType<WarehouseDTO>(actionResult.Value);

        Assert.Equal("ABC", resultDTO.Code);
        Assert.Equal("desc", resultDTO.Description);
        Assert.Equivalent(addressDTO, resultDTO.Address);
        Assert.Equivalent(coordinatesDTO, resultDTO.Coordinates);
    }

    [Fact(DisplayName = "Should create Warehouse - fail invalid data")]
    public async void ShouldCreateWarehouseFailInvalidData()
    {
        var addressDTO = new WarehouseAddressDTO("", "4000", "city", "country");
        var coordinatesDTO = new WarehouseCoordinatesDTO(8, -10);
        var dto = new CreateWarehouseDTO(true, "foobar", "desc", addressDTO, coordinatesDTO);
        var result = await controller.Create(dto);

        var actionResult = Assert.IsType<BadRequestObjectResult>(result.Result);
    }
}
}
