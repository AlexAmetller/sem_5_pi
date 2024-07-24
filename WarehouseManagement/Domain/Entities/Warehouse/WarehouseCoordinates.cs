using Domain.Shared;

namespace Domain.Entities;

public class WarehouseCoordinates : IValueObject
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public WarehouseCoordinates(){}

    public WarehouseCoordinates(double latitude, double longitude)
    {
        if (latitude < -90 || latitude > 90)
        {
            throw new BusinessRuleValidationException("Invalid latitude, must be between -90 and 90.");
        }
        if (latitude < -180 || latitude > 180)
        {
            throw new BusinessRuleValidationException("Invalid latitude, must be between -180 and 180.");
        }
        this.Latitude = latitude;
        this.Longitude = longitude;
    }
}