using System.Text.Json.Serialization;
using Domain.Shared;

namespace Domain.Entities;

public class WarehouseId : EntityId
{
    [JsonConstructor]
    public WarehouseId(Guid value) : base(value) { }

    public WarehouseId(String value) : base(value) { }

    override
    protected Object createFromString(String text)
    {
        return new Guid(text);
    }

    override
    public String AsString()
    {
        Guid obj = (Guid)base.ObjValue;

        return obj.ToString();
    }

    public Guid AsGuid()
    {
        return (Guid)base.ObjValue;
    }
}