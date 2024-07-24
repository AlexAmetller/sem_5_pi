interface IDeliveryDTO {
  code: string;
  date: string;
  mass: number;
  loadingTime: number;
  withdrawingTime: number;
  destinationWarehouse: IWarehouseDTO;
}

interface IWarehouseDTO {
  code: string;
  description: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export { IDeliveryDTO, IWarehouseDTO };
