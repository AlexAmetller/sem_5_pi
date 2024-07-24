using Domain.Shared;
using System.Text.RegularExpressions;

namespace Domain.Entities;

public class WarehouseAddress : IValueObject
{
    public string Street { get; set; }
    public string PostalCode { get; set; }
    public string City { get; set; }
    public string Country { get; set; }

    public WarehouseAddress()
    {
    }

    public WarehouseAddress(string street, string postalcode, string city, string country)
    {
        if (street.Length < 10)
        {
            throw new BusinessRuleValidationException("Invalid street, too short.");
        }

        if (country.Length < 3)
        {
            throw new BusinessRuleValidationException("Invalid country, too short.");
        }

        if (city.Length < 3)
        {
            throw new BusinessRuleValidationException("Invalid city, too short.");
        }

        if (!Regex.IsMatch(postalcode, "^[0-9]{4}-[0-9]{3}$"))
        {
            throw new BusinessRuleValidationException("Invalid postal code, invalid pattern.");
        }
        this.Street = street;
        this.City = city;
        this.PostalCode = postalcode;
        this.Country = country;
    }
}