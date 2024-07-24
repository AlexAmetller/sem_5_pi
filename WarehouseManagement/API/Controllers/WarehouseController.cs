using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("Warehouse")]
public class WarehouseController : ControllerBase
{
    private readonly IWarehouseService _warehouseService;

    public WarehouseController(IWarehouseService warehouseService)
    {
        this._warehouseService = warehouseService;
    }

    [HttpGet]
    [Authorize(Roles = "warehouse-manager,logistics-manager")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<WarehouseDTO>>> GetAll()
    {
        try
        {
            return await _warehouseService.GetAllAsync();
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("{code}")]
    [Authorize(Roles = "warehouse-manager,logistics-manager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<WarehouseDTO>> GetByCode(string code)
    {
        try
        {
            var output = await _warehouseService.GetByCodeAsync(code);
            if (output == null)
                return NotFound();
            return Ok(output);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost]
    [Authorize(Roles = "warehouse-manager")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<WarehouseDTO>> Create(CreateWarehouseDTO input)
    {
        if (input.Enabled == null)
            ModelState.AddModelError("enabled", "enabled is required");
        if (input.Code == null)
            ModelState.AddModelError("code", "code is required");
        if (input.Address == null)
            ModelState.AddModelError("address", "address is required");
        if (input.Coordinates == null)
            ModelState.AddModelError("coordinates", "coordinates is required");
        if (input.Description == null)
            ModelState.AddModelError("description", "description is required");
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var output = await _warehouseService.AddAsync(input);
            return CreatedAtAction(nameof(Create), output);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPut("{code}")]
    [Authorize(Roles = "warehouse-manager")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<WarehouseDTO>> Update(string code, [FromBody] UpdateWarehouseDTO input)
    {
        if (input.Address == null)
            ModelState.AddModelError("address", "address is required");
        if (input.Coordinates == null)
            ModelState.AddModelError("coordinates", "coordinates is required");
        if (input.Description == null)
            ModelState.AddModelError("description", "description is required");

        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var output = await _warehouseService.UpdateAsync(code, input);

            return output;
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}