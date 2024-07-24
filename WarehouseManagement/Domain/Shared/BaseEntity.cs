namespace Domain.Shared;

public abstract class BaseEntity<TEntityId> : IEquatable<BaseEntity<TEntityId>>
where TEntityId : EntityId
{
    public TEntityId Id { get; protected set; }

    // public string Code { get; set; }

    // public bool State { get; set; }

    // public virtual void MarkAsInactive()
    // {
    //     this.State = false;
    // }

    public BaseEntity(TEntityId id)
    {
        Id = id;
    }

    public BaseEntity(){}

    //Two entities are the same if their Id's are the same
    public override bool Equals(object obj)
    {
        return obj is BaseEntity<TEntityId> entity && Id.Equals(entity.Id);
    }

    public bool Equals(BaseEntity<TEntityId> other)
    {
        return Equals((object)other);
    }

    public static bool operator ==(BaseEntity<TEntityId> left, BaseEntity<TEntityId> right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(BaseEntity<TEntityId> left, BaseEntity<TEntityId> right)
    {
        return !Equals(left, right);
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
}