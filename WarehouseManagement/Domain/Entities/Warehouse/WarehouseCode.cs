using Domain.Shared;
using System.Text.RegularExpressions;

namespace Domain.Entities;

public class WarehouseCode : IValueObject
{
    public string Value { get; set; }

    public WarehouseCode(){}

    public WarehouseCode(string code)
    {
        if (!Regex.IsMatch(code, "^[a-zA-Z0-9]{3}$"))
        {
            throw new BusinessRuleValidationException("Invalid code, length must be 3.");
        }
        this.Value = code;
    }
}