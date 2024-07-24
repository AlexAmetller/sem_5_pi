import axios from 'axios'
import trucks from './data/trucks.js'
import paths from './data/paths.js'
import warehouses from './data/warehouses.js'
import deliveries from './data/deliveries.js'
import schedules from './data/schedules.js'
import packagings from './data/packagings.js'
import users from './data/users.js'
import {
  adminToken,
  fleetToken,
  logisticsToken,
  warehouseToken,
} from './token.js'
;(async function main() {
  await post(warehouses, `http://localhost:3001/warehouse`, warehouseToken)
  await post(deliveries, `http://localhost:3001/delivery`, warehouseToken)
  await post(trucks, `http://localhost:3002/api/trucks`, fleetToken)
  await post(paths, `http://localhost:3002/api/paths`, logisticsToken)
  await post(packagings, `http://localhost:3002/api/packagings`, logisticsToken)
  for (const schedule of schedules)
    await post(
      [schedule],
      `http://localhost:3002/api/schedules`,
      logisticsToken
    )
  await post(users, `http://localhost:3004/users`, adminToken)
})()

async function post(objs, url, token) {
  return Promise.all(
    objs.map(async (obj) =>
      axios
        .post(url, obj, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => console.log(res.data))
        .catch((err) =>
          console.log({ obj, error: JSON.stringify(err.response.data) })
        )
    )
  )
}
