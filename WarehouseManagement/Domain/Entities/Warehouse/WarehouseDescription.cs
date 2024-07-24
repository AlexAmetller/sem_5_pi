using Domain.Shared;

namespace Domain.Entities;

public class WarehouseDescription : IValueObject
{
    public string Value { get; set; }

    public WarehouseDescription(){}

    public WarehouseDescription(string description)
    {
        if (description.Length > 50)
        {
            throw new BusinessRuleValidationException("Invalid description, max 50 characters.");
        }
        this.Value = description;
    }
}