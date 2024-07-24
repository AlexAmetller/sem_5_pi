import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';
import { PackagingXPosition } from './packagingXPosition';
import { PackagingYPosition } from './packagingYPosition';
import { PackagingZPosition } from './packagingZPosition';
import { PackagingLoadingTime } from './packagingLoadingTime';
import { PackagingWithdrawingTime } from './packagingWithdrawingTime';
import { PackagingId } from './packagingId';
import { PackagingDeliveryId } from './packagingDeliveryId';

export interface PackagingProps {
  xposition: PackagingXPosition;
  yposition: PackagingYPosition;
  zposition: PackagingZPosition;
  loadingTime: PackagingLoadingTime;
  withdrawingTime: PackagingWithdrawingTime;
  deliveryId: PackagingDeliveryId;
}

export class Packaging extends AggregateRoot<PackagingProps> {
  get id(): PackagingId {
    return this._id;
  }

  private constructor(props: PackagingProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: {
      xposition: number;
      yposition: number;
      zposition: number;
      loadingTime: number;
      withdrawingTime: number;
      deliveryId: string;
    },
    id?: UniqueEntityID,
  ): Result<Packaging> {
    const guardedProps = [
      { argument: props.xposition, argumentName: 'xposition' },
      { argument: props.yposition, argumentName: 'yposition' },
      { argument: props.zposition, argumentName: 'zposition' },
      { argument: props.loadingTime, argumentName: 'LoadingTime' },
      { argument: props.withdrawingTime, argumentName: 'WithdrawingTime' },
      { argument: props.deliveryId, argumentName: 'DeliveryId' },
    ];

    const entityProps = {
      xposition: PackagingXPosition.create(props.xposition),
      yposition: PackagingYPosition.create(props.yposition),
      zposition: PackagingZPosition.create(props.zposition),
      loadingTime: PackagingLoadingTime.create(props.loadingTime),
      withdrawingTime: PackagingWithdrawingTime.create(props.withdrawingTime),
      deliveryId: PackagingDeliveryId.create(props.deliveryId),
    };

    const guardResult = Guard.combine([
      Guard.againstNullOrUndefinedBulk(guardedProps),
      Guard.againstFailedResults(Object.values(entityProps)),
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Packaging>(guardResult.errors);
    } else {
      const packaging = new Packaging(
        {
          xposition: entityProps.xposition.getValue(),
          yposition: entityProps.yposition.getValue(),
          zposition: entityProps.zposition.getValue(),
          loadingTime: entityProps.loadingTime.getValue(),
          withdrawingTime: entityProps.withdrawingTime.getValue(),
          deliveryId: entityProps.deliveryId.getValue(),
        },
        id,
      );
      return Result.ok<Packaging>(packaging);
    }
  }

  get xposition(): PackagingXPosition {
    return this.props.xposition;
  }

  get yposition(): PackagingYPosition {
    return this.props.yposition;
  }

  get zposition(): PackagingZPosition {
    return this.props.zposition;
  }

  get loadingTime(): PackagingLoadingTime {
    return this.props.loadingTime;
  }

  get withdrawingTime(): PackagingLoadingTime {
    return this.props.withdrawingTime;
  }

  get deliveryId(): PackagingDeliveryId {
    return this.props.deliveryId;
  }
}
