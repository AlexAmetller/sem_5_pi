import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Document, Model } from 'mongoose';
import { Container } from 'typedi';
import IPackagingService from '../src/services/IServices/IPackagingService';
import IPackagingRepo from '../src/services/IRepos/IPackagingRepo';
import WarehouseGateway from '../src/gateway/warehouseGateway';
import PackagingRepo from '../src/repos/packagingRepo';
import { IPackagingPersistence } from '../src/dataschema/IPackagingPersistence';
import IPackagingController from '../src/controllers/IControllers/IPackagingController';
import IWarehouseGateway from '../src/gateway/IGateway/IWarehouseGateway';

describe.skip('packaging controller', function() {
  const sandbox = sinon.createSandbox();
  let packagingSchemaInstance: Model<IPackagingPersistence & Document>;
  let packagingRepoInstance: IPackagingRepo;
  let packagingServiceInstance: IPackagingService;
  let packagingControllerInstance: IPackagingController;
  let warehouseGatewayInstance: IWarehouseGateway;

  beforeEach(function(done) {
    Container.reset();

    packagingSchemaInstance = require('../src/persistence/schemas/packagingSchema').default;
    Container.set('packagingSchema', packagingSchemaInstance);

    warehouseGatewayInstance = new WarehouseGateway();
    Container.set('WarehouseGateway', packagingRepoInstance);

    packagingRepoInstance = new PackagingRepo(packagingSchemaInstance);
    Container.set('PackagingRepo', packagingRepoInstance);

    const packagingServiceClass = require('../src/services/packagingService').default;
    packagingServiceInstance = Container.get(packagingServiceClass);
    Container.set('PackagingService', packagingServiceInstance);

    const packagingControllerClass = require('../src/controllers/packagingController').default;
    packagingControllerInstance = Container.get(packagingControllerClass);
    Container.set('PackagingController', packagingControllerInstance);
    done();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('edit packaging', () => {
    it('success - complete update', async function() {
      // Arrange
      const req = {
        body: {
          xposition: 5,
          yposition: 5,
          zposition: 5,
          deliveryId: '3f241e13-2c44-42eb-8a7d-c5e500882e51',
        },
        params: { id: 'foobar' },
      } as any;
      const res = {} as any;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      const next = () => {};

      sandbox.replace(
        packagingSchemaInstance,
        'findOne',
        sinon.fake(
          ({ domainId }) =>
            ({
              xposition: 8,
              yposition: 8,
              zposition: 8,
              loadingTime: 5,
              withdrawingTime: 50,
              deliveryId: '3f241e13-2c44-42eb-8a7d-c5e500882e51',
              domainId,
            } as any),
        ),
      );

      sandbox.replace(
        packagingRepoInstance,
        'save',
        sinon.fake(packaging => packaging as any),
      );

      sandbox.replace(
        warehouseGatewayInstance,
        'getDelivery',
        sinon.fake(
          id =>
            ({
              id: id,
              code: 'ABC',
              date: null,
              mass: null,
              loadingTime: 5,
              withdrawingTime: 50,
              destinationWarehouse: null,
            } as any),
        ),
      );

      // Act
      await packagingControllerInstance.updatePackaging(
        (req as any) as Request,
        (res as any) as Response,
        next as NextFunction,
      );

      // Assert
      sinon.assert.calledWith(res.status, sinon.match(200));
      sinon.assert.calledWith(
        res.json,
        sinon.match({
          id: 'foobar',
          xposition: 5,
          yposition: 5,
          zposition: 5,
          loadingTime: 5,
          withdrawingTime: 50,
          deliveryId: '3f241e13-2c44-42eb-8a7d-c5e500882e51',
        }),
      );
    });

    it('success - partial update', async function() {
      // Arrange
      const req = {
        body: {
          xposition: 2,
        },
        params: { id: 'foobar' },
      } as any;
      const res = {} as any;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      const next = () => {};

      sandbox.replace(
        packagingSchemaInstance,
        'findOne',
        sinon.fake(
          ({ domainId }) =>
            ({
              xposition: 5,
              yposition: 5,
              zposition: 5,
              loadingTime: 5,
              withdrawingTime: 50,
              deliveryId: '3f241e13-2c44-42eb-8a7d-c5e500882e51',
              domainId,
            } as any),
        ),
      );

      sandbox.replace(
        warehouseGatewayInstance,
        'getDelivery',
        sinon.fake(
          id =>
            ({
              id: id,
              code: 'ABC',
              date: null,
              mass: null,
              loadingTime: 5,
              withdrawingTime: 50,
              destinationWarehouse: null,
            } as any),
        ),
      );

      sandbox.replace(
        packagingRepoInstance,
        'save',
        sinon.fake(packaging => packaging as any),
      );

      // Act
      await packagingControllerInstance.updatePackaging(
        (req as any) as Request,
        (res as any) as Response,
        next as NextFunction,
      );

      // Assert
      sinon.assert.calledWith(res.status, sinon.match(200));
      sinon.assert.calledWith(
        res.json,
        sinon.match({
          id: 'foobar',
          xposition: 2,
          yposition: 5,
          zposition: 5,
          loadingTime: 5,
          withdrawingTime: 50,
          deliveryId: '3f241e13-2c44-42eb-8a7d-c5e500882e51',
        }),
      );
    });

    it('fail - missing id param 404', async function() {
      // Arrange
      const req = {
        body: {
          xposition: 5,
          yposition: 5,
          zposition: 5,
          deliveryId: '3f241e13-2c44-42eb-8a7d-c5e500882e51',
        },
        params: {},
      } as any;
      const res = {} as any;
      res.status = sinon.stub().returns(res);
      const next = () => {};

      // Act
      await packagingControllerInstance.updatePackaging(
        (req as any) as Request,
        (res as any) as Response,
        next as NextFunction,
      );

      // Assert
      sinon.assert.calledWith(res.status, sinon.match(404));
    });

    it('fail - invalid data 400', async function() {
      // Arrange
      const req = {
        body: {
          xposition: 50, // -- fails
          yposition: 5,
          zposition: 5,
          deliveryId: '3f241e13-2c44-42eb-8a7d-c5e500882e51',
        },
        params: { id: 'foobar' },
      } as any;

      const res = {} as any;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      const next = () => {};

      sandbox.replace(
        packagingSchemaInstance,
        'findOne',
        sinon.fake(
          ({ domainId }) =>
            ({
              xposition: 8,
              yposition: 8,
              zposition: 8,
              loadingTime: 5,
              withdrawingTime: 50,
              deliveryId: '3f241e13-2c44-42eb-8a7d-c5e500882e51',
              domainId,
            } as any),
        ),
      );

      // Act
      await packagingControllerInstance.updatePackaging(
        (req as any) as Request,
        (res as any) as Response,
        next as NextFunction,
      );

      // Assert
      sinon.assert.calledWith(res.status, sinon.match(400));
      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, sinon.match.has('errors'));
    });
  });
});
