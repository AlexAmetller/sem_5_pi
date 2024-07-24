using Domain.Shared;
using System.Text.RegularExpressions;

namespace Domain.Entities;

public class WarehouseEnabled : IValueObject
{
    public bool Value { get; set; }

    public WarehouseEnabled(){}

    public WarehouseEnabled(bool enabled) { this.Value = enabled; }
}