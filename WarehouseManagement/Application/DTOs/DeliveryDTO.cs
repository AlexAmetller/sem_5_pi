namespace Application.DTOs;

public class DeliveryDTO
{
    public string Code { get; set; }
    public DateTime Date { get; set; }
    public double Mass { get; set; }
    public int LoadingTime { get; set; }
    public int WithdrawingTime { get; set; }
    public string DestinationWarehouseCode { get; set; }

    public DeliveryDTO(string code, DateTime date, double mass, int loadingTime, int withdrawingTime, string destinationWarehouseCode)
    {
        this.Code = code;
        this.Date = date;
        this.Mass = mass;
        this.LoadingTime = loadingTime;
        this.WithdrawingTime = withdrawingTime;
        this.DestinationWarehouseCode = destinationWarehouseCode;
    }
}

public class DeliveryWithWarehouseDTO
{
    public string Code { get; set; }
    public DateTime Date { get; set; }
    public double Mass { get; set; }
    public int LoadingTime { get; set; }
    public int WithdrawingTime { get; set; }
    public string DestinationWarehouseCode { get; set; }
    public WarehouseDTO DestinationWarehouse { get; set; }

    public DeliveryWithWarehouseDTO(string code, DateTime date, double mass, int loadingTime, int withdrawingTime, WarehouseDTO destinationWarehouse, string destinationWarehouseCode)
    {
        this.Code = code;
        this.Date = date;
        this.Mass = mass;
        this.LoadingTime = loadingTime;
        this.WithdrawingTime = withdrawingTime;
        this.DestinationWarehouse = destinationWarehouse;
        this.DestinationWarehouseCode = destinationWarehouseCode;
    }
}


public class CreateDeliveryDTO
{
    public string Code { get; set; }
    public DateTime Date { get; set; }
    public double Mass { get; set; }
    public int LoadingTime { get; set; }
    public int WithdrawingTime { get; set; }
    public string DestinationWarehouseCode { get; set; }


    public CreateDeliveryDTO(string code, DateTime date, double mass, int loadingTime, int withdrawingTime, string destinationWarehouseCode)
    {
        this.Code = code;
        this.Date = date;
        this.Mass = mass;
        this.LoadingTime = loadingTime;
        this.WithdrawingTime = withdrawingTime;
        this.DestinationWarehouseCode = destinationWarehouseCode;
    }
}

public class UpdateDeliveryDTO
{
    public DateTime Date { get; set; }
    public double Mass { get; set; }
    public int LoadingTime { get; set; }
    public int WithdrawingTime { get; set; }


    public UpdateDeliveryDTO(DateTime date, double mass, int loadingTime, int withdrawingTime)
    {
        this.Date = date;
        this.Mass = mass;
        this.LoadingTime = loadingTime;
        this.WithdrawingTime = withdrawingTime;
    }
}
