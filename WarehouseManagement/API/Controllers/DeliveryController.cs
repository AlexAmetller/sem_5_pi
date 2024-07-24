using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("Delivery")]
public class DeliveryController : ControllerBase
{
    private readonly IDeliveryService _deliveryService;

    public DeliveryController(IDeliveryService deliveryService)
    {
        this._deliveryService = deliveryService;
    }

    [HttpGet]
    [Authorize(Roles = "warehouse-manager,logistics-manager")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<DeliveryDTO>>> GetAll()
    {
        try
        {
            return Ok(await _deliveryService.GetAllAsync());
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
    public async Task<ActionResult<DeliveryWithWarehouseDTO>> GetByCode(string code)
    {
        try
        {
            var output = await _deliveryService.GetByCodeAsync(code);
            if (output == null) return NotFound();
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
    public async Task<ActionResult<DeliveryDTO>> Create(CreateDeliveryDTO input)
    {
        if (input.Code == null) ModelState.AddModelError("code", "code is required");
        if (input.Date == null) ModelState.AddModelError("date", "date is required");
        if (input.DestinationWarehouseCode == null) ModelState.AddModelError("destinationWarehouseCode", "destinationWarehouseCode is required");
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _deliveryService.AddAsync(input);
            return result;
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
    public async Task<ActionResult<DeliveryDTO>> Update(string code, [FromBody] UpdateDeliveryDTO input)
    {
        if (input.Date == null) ModelState.AddModelError("date", "date is required");
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            return await _deliveryService.UpdateAsync(code, input);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}