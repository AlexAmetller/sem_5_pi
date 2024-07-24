/**
 * @openapi
 * components:
 *   schemas:
 *     Delivery:
 *       properties:
 *         id:
 *           title: Delivery.id
 *           type: string
 *         code:
 *           title: Delivery.code
 *           type: string
 *         date:
 *           title: Delivery.date
 *           type: string
 *         mass:
 *           title: Delivery.mass
 *           type: number
 *         loadingTime:
 *           title: Delivery.loadingTime
 *           type: number
 *         withdrawingTime:
 *           title: Delivery.withdrawingTime
 *           type: number
 *         destinationWarehouse:
 *           $ref: '#/components/schemas/Warehouse'
 *           title: Delivery.destinationWarehouse
 *       required:
 *         - id
 *         - code
 *         - date
 *         - mass
 *         - loadingTime
 *         - withdrawingTime
 *         - destinationWarehouse
 *       additionalProperties: false
 *       title: Delivery
 *       type: object
 *     Warehouse:
 *       properties:
 *         id:
 *           title: Warehouse.id
 *           type: string
 *         code:
 *           title: Warehouse.code
 *           type: string
 *         date:
 *           title: Warehouse.date
 *           type: string
 *         mass:
 *           title: Warehouse.mass
 *           type: number
 *         loadingTime:
 *           title: Warehouse.loadingTime
 *           type: number
 *         withdrawingTime:
 *           title: Warehouse.withdrawingTime
 *           type: number
 *         destinationWarehouse:
 *           properties:
 *             id:
 *               title: Warehouse.destinationWarehouse.id
 *               type: string
 *             code:
 *               title: Warehouse.destinationWarehouse.code
 *               type: string
 *             description:
 *               title: Warehouse.destinationWarehouse.description
 *               type: string
 *             address:
 *               properties:
 *                 street:
 *                   title: Warehouse.destinationWarehouse.address.street
 *                   type: string
 *                 postalCode:
 *                   title: Warehouse.destinationWarehouse.address.postalCode
 *                   type: string
 *                 city:
 *                   title: Warehouse.destinationWarehouse.address.city
 *                   type: string
 *                 country:
 *                   title: Warehouse.destinationWarehouse.address.country
 *                   type: string
 *               required:
 *                 - street
 *                 - postalCode
 *                 - city
 *                 - country
 *               additionalProperties: false
 *               title: Warehouse.destinationWarehouse.address
 *               type: object
 *             coordinates:
 *               properties:
 *                 latitude:
 *                   title: Warehouse.destinationWarehouse.coordinates.latitude
 *                   type: number
 *                 longitude:
 *                   title: Warehouse.destinationWarehouse.coordinates.longitude
 *                   type: number
 *               required:
 *                 - latitude
 *                 - longitude
 *               additionalProperties: false
 *               title: Warehouse.destinationWarehouse.coordinates
 *               type: object
 *           required:
 *             - id
 *             - code
 *             - description
 *             - address
 *             - coordinates
 *           additionalProperties: false
 *           title: Warehouse.destinationWarehouse
 *           type: object
 *       required:
 *         - id
 *         - code
 *         - date
 *         - mass
 *         - loadingTime
 *         - withdrawingTime
 *         - destinationWarehouse
 *       additionalProperties: false
 *       title: Warehouse
 *       type: object
 */
