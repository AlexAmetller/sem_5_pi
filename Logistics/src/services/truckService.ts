import { Service, Inject } from 'typedi';
import config from '../../config';
import { Truck } from '../domain/truck/truck';
import { ICreateTruckDTO, IGetTruckDTO, IUpdateTruckDTO } from '../dto/ITruckDTO';
import ITruckRepo from '../services/IRepos/ITruckRepo';
import ITruckService from './IServices/ITruckService';
import { Result } from '../core/logic/Result';
import { TruckMap } from '../mappers/TruckMap';
import { TruckId } from '../domain/truck/truckId';

@Service()
export default class TruckService implements ITruckService {
  constructor(@Inject(config.repos.truck.name) private truckRepo: ITruckRepo) {}

  async getTruck(truckId: string): Promise<Result<IGetTruckDTO>> {
    const truck = await this.truckRepo.findById(truckId);

    if (truck === null) return Result.fail<IGetTruckDTO>('Truck not found.');

    const truckDTO = TruckMap.toDTO(truck);

    return Result.ok<IGetTruckDTO>(truckDTO);
  }

  async getTrucks(): Promise<Result<IGetTruckDTO[]>> {
    try {
      const truck = await this.truckRepo.findAll();

      if (truck === null) {
        return Result.fail<IGetTruckDTO[]>('No truck found');
      } else {
        const resultDTO = truck.map(item => TruckMap.toDTO(item));
        return Result.ok<IGetTruckDTO[]>(resultDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  public async createTruck(truckDTO: ICreateTruckDTO): Promise<Result<IGetTruckDTO>> {
    try {
      const idOrError = TruckId.create(truckDTO.id);

      if (idOrError.isFailure) {
        return Result.fail<IGetTruckDTO>(idOrError.errorValue());
      }

      const truckOrError = Truck.create({ ...truckDTO, enabled: true }, idOrError.getValue());

      if (truckOrError.isFailure) {
        return Result.fail<IGetTruckDTO>(truckOrError.errorValue());
      }

      const existingTruck = await this.truckRepo.findById(truckDTO.id);

      if (existingTruck !== null) {
        return Result.fail<IGetTruckDTO>('Truck already exists');
      }

      const truckResult = truckOrError.getValue();
      const truck = await this.truckRepo.save(truckResult);
      const resultDTO = TruckMap.toDTO(truck);
      return Result.ok<IGetTruckDTO>(resultDTO);
    } catch (e) {
      throw e;
    }
  }

  async updateTruck(truckId: string, truckDTO: IUpdateTruckDTO): Promise<Result<IGetTruckDTO>> {
    try {
      const truck = await this.truckRepo.findById(truckId);

      if (truck === null) {
        return Result.fail<IGetTruckDTO>('Truck not found');
      } else {
        const truckOrError = Truck.create(
          {
            tare: truckDTO.tare ?? truck.tare.value,
            maxWeight: truckDTO.maxWeight ?? truck.maxWeight.value,
            maxCharge: truckDTO.maxCharge ?? truck.maxCharge.value,
            range: truckDTO.range ?? truck.range.value,
            chargingTime: truckDTO.chargingTime ?? truck.chargingTime.value,
            enabled: truckDTO.enabled ?? truck.enabled.value,
          },
          truck.id,
        );

        if (truckOrError.isFailure) {
          return Result.fail<IGetTruckDTO>(truckOrError.errorValue());
        }

        const truckResult = truckOrError.getValue();
        const updatedTruck = await this.truckRepo.save(truckResult);
        const resultDTO = TruckMap.toDTO(updatedTruck);
        return Result.ok<IGetTruckDTO>(resultDTO);
      }
    } catch (e) {
      throw e;
    }
  }
}
