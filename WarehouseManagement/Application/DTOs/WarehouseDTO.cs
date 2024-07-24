namespace Application.DTOs;

public class WarehouseCoordinatesDTO
{
    public double Latitude { get; }
    public double Longitude { get; }
    public WarehouseCoordinatesDTO(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }
}

public class WarehouseAddressDTO
{
    public string Street { get; }
    public string PostalCode { get; }
    public string City { get; }
    public string Country { get; }
    public WarehouseAddressDTO(string street, string postalCode, string city, string country)
    {
        Street = street;
        PostalCode = postalCode;
        City = city;
        Country = country;
    }
}

public class WarehouseDTO
{
    public bool Enabled { get; }
    public string Code { get; }
    public string Description { get; }
    public WarehouseAddressDTO Address { get; }
    public WarehouseCoordinatesDTO Coordinates { get; }

    public WarehouseDTO(bool enabled, string code, string description,
                        WarehouseAddressDTO address,
                        WarehouseCoordinatesDTO coordinates)
    {
        Enabled = enabled;
        Code = code;
        Description = description;
        Address = address;
        Coordinates = coordinates;
    }
}

public class CreateWarehouseDTO
{
    public bool Enabled { get; }
    public string Code { get; }
    public string Description { get; }
    public WarehouseAddressDTO Address { get; }
    public WarehouseCoordinatesDTO Coordinates { get; }
    public CreateWarehouseDTO(bool enabled, string code, string description,
                                WarehouseAddressDTO address,
                                WarehouseCoordinatesDTO coordinates)
    {
        Enabled = enabled;
        Code = code;
        Description = description;
        Address = address;
        Coordinates = coordinates;
    }
}

public class UpdateWarehouseDTO
{
    public bool Enabled { get; }
    public string Description { get; }
    public WarehouseAddressDTO Address { get; }
    public WarehouseCoordinatesDTO Coordinates { get; }
    public UpdateWarehouseDTO(bool enabled, string description,
                                WarehouseAddressDTO address,
                                WarehouseCoordinatesDTO coordinates)
    {
        Enabled = enabled;
        Description = description;
        Address = address;
        Coordinates = coordinates;
    }
}