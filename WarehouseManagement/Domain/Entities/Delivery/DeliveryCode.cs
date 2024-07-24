using Domain.Shared;
using System.Text.RegularExpressions;

namespace Domain.Entities;

public class DeliveryCode : IValueObject
{
    public string Value { get; set; }

    public DeliveryCode(){}

    public DeliveryCode(string name)
    {
        if (!Regex.IsMatch(name, "^[a-zA-Z0-9]{4}$"))
        {
            throw new BusinessRuleValidationException("Invalid code, must be 4 alphanumeric characters.");
        }
        this.Value = name;
    }
}