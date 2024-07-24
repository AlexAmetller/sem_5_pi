import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Document, Model } from 'mongoose';
import { Container } from 'typedi';
import ITruckService from '../src/services/IServices/ITruckService';
import ITruckRepo from '../src/services/IRepos/ITruckRepo';
import TruckRepo from '../src/repos/truckRepo';
import { ITruckPersistence } from '../src/dataschema/ITruckPersistence';
import ITruckController from '../src/controllers/IControllers/ITruckController';

describe.skip('truck controller', function() {
  const sandbox = sinon.createSandbox();
  let truckSchemaInstance: Model<ITruckPersistence & Document>;
  let truckRepoInstance: ITruckRepo;
  let truckServiceInstance: ITruckService;
  let truckControllerInstance: ITruckController;

  beforeEach(function(done) {
    Container.reset();

    truckSchemaInstance = require('../src/persistence/schemas/truckSchema').default;
    Container.set('truckSchema', truckSchemaInstance);

    truckRepoInstance = new TruckRepo(truckSchemaInstance);
    Container.set('TruckRepo', truckRepoInstance);

    const truckServiceClass = require('../src/services/truckService').default;
    truckServiceInstance = Container.get(truckServiceClass);
    Container.set('TruckService', truckServiceInstance);

    const truckControllerClass = require('../src/controllers/truckController').default;
    truckControllerInstance = Container.get(truckControllerClass);
    Container.set('TruckController', truckControllerInstance);
    done();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('edit truck', () => {
    it('success - complete update', async function() {
      // Arrange
      const req = {
        body: {
          tare: 10,
          maxWeight: 10,
          maxCharge: 10,
          range: 10,
          chargingTime: 10,
        },
        params: { id: 'foobar' },
      } as any;
      const res = {} as any;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      const next = () => {};

      sandbox.replace(
        truckSchemaInstance,
        'findOne',
        sinon.fake(
          ({ domainId }) =>
            ({
              tare: 99,
              maxWeight: 99,
              maxCharge: 99,
              range: 99,
              chargingTime: 99,
              domainId,
            } as any),
        ),
      );

      sandbox.replace(
        truckRepoInstance,
        'save',
        sinon.fake(truck => truck as any),
      );

      // Act
      await truckControllerInstance.updateTruck(
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
          tare: 10,
          maxWeight: 10,
          maxCharge: 10,
          range: 10,
          chargingTime: 10,
        }),
      );
    });

    it('success - partial update', async function() {
      // Arrange
      const req = {
        body: {
          tare: 10,
          maxWeight: 10,
        },
        params: { id: 'foobar' },
      } as any;
      const res = {} as any;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      const next = () => {};

      sandbox.replace(
        truckSchemaInstance,
        'findOne',
        sinon.fake(
          ({ domainId }) =>
            ({
              tare: 99,
              maxWeight: 99,
              maxCharge: 99,
              range: 99,
              chargingTime: 99,
              domainId,
            } as any),
        ),
      );

      sandbox.replace(
        truckRepoInstance,
        'save',
        sinon.fake(truck => truck as any),
      );

      // Act
      await truckControllerInstance.updateTruck(
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
          tare: 10,
          maxWeight: 10,
          maxCharge: 99,
          range: 99,
          chargingTime: 99,
        }),
      );
    });

    it('fail - missing id param 404', async function() {
      // Arrange
      const req = {
        body: {
          tare: 0,
          maxWeight: 0,
          maxCharge: 0,
          range: 0,
          chargingTime: 0, // -- fails
        },
        params: {},
      } as any;
      const res = {} as any;
      res.status = sinon.stub().returns(res);
      const next = () => {};

      // Act
      await truckControllerInstance.updateTruck(
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
          tare: 0,
          maxWeight: 0,
          maxCharge: 0,
          range: 0,
          chargingTime: 0, // -- fails
        },
        params: { id: 'foobar' },
      } as any;

      const res = {} as any;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      const next = () => {};

      sandbox.replace(
        truckSchemaInstance,
        'findOne',
        sinon.fake(
          ({ domainId }) =>
            ({
              tare: 99,
              maxWeight: 99,
              maxCharge: 99,
              range: 99,
              chargingTime: 99,
              domainId,
            } as any),
        ),
      );

      // Act
      await truckControllerInstance.updateTruck(
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

  describe('create truck', () => {
    it.skip('success - truck created', async function() {
      // Arrange
      const req = {
        body: {
          tare: 7500,
          maxWeight: 4300,
          maxCharge: 80,
          range: 100,
          chargingTime: 60,
        },
      } as any;
      const res = {} as any;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      const next = () => {};

      sandbox.replace(
        truckRepoInstance,
        'save',
        sinon.fake(truck => truck as any),
      );

      // Act
      await truckControllerInstance.createTruck(
        (req as any) as Request,
        (res as any) as Response,
        next as NextFunction,
      );

      // Assert
      sinon.assert.calledWith(res.status, sinon.match(201));
      sinon.assert.calledWith(res.json, sinon.match.has('id'));
      sinon.assert.calledWith(
        res.json,
        sinon.match({
          tare: 7500,
          maxWeight: 4300,
          maxCharge: 80,
          range: 100,
          chargingTime: 60,
        }),
      );
    });

    it.skip('fail - invalid data 400', async function() {
      // Arrange
      const req = {
        body: {
          tare: 0,
          maxWeight: 0,
          maxCharge: 0,
          range: 0,
          chargingTime: 0, // -- fails
        },
        params: { id: 'foobar' },
      } as any;

      const res = {} as any;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      const next = () => {};

      sandbox.replace(
        truckRepoInstance,
        'save',
        sinon.fake(truck => truck as any),
      );

      // Act
      await truckControllerInstance.createTruck(
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
