namespace Domain.Shared;

public abstract class AggregateRoot<TEntityId> : BaseEntity<TEntityId>
    where TEntityId : EntityId
{
    protected AggregateRoot(TEntityId id) : base(id) { }

    protected AggregateRoot() { }
}