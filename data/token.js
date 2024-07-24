import jwt from 'jsonwebtoken'
import users from './data/users.js'

// openssl ecparam -genkey -name prime256v1 -noout -out ec_private.pem
// openssl ec -in ec_private.pem -pubout -out ec_public.pem
// const token = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGF0YS1sb2FkZXIiLCJyb2xlIjoiYWRtaW4iLCJtYWlsIjoiZGF0YUBsb2FkZXIuY29tIiwiaWF0IjoxNjcxNjUxMTY5fQ.y78pBvEqVFOkKiLy2jJe87T3cmqA3fe9Ad5OT_kkjCvrbR9tsFtCrjeNnY6wkKzwKf1NGu2TKduZn7mhmwTifA'
const private_key =
  '-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIDPYhJfTkikuDKd4pHrG1KazQwTzDe8jVPD85hDbrSIgoAoGCCqGSM49\nAwEHoUQDQgAE72qzknXhCtUt/WiI22CM3FKC41ES/c5M/zdhSOKqH7ZFBhlm7QOc\n0gNvBjByJpHV2Gb0pxMPEQ3Hprih0wDQHg==\n-----END EC PRIVATE KEY-----'
const public_key =
  '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE72qzknXhCtUt/WiI22CM3FKC41ES\n/c5M/zdhSOKqH7ZFBhlm7QOc0gNvBjByJpHV2Gb0pxMPEQ3Hprih0wDQHg==\n-----END PUBLIC KEY-----'

function genToken(user) {
  return jwt.sign(user, private_key, {
    expiresIn: '30m',
    algorithm: 'ES256',
  })
}

const admin = users.find((user) => user.role === 'admin')
const logistics = users.find((user) => user.role === 'logistics-manager')
const warehouse = users.find((user) => user.role === 'warehouse-manager')
const fleet = users.find((user) => user.role === 'fleet-manager')

const adminToken = genToken(admin)
const logisticsToken = genToken(logistics)
const warehouseToken = genToken(warehouse)
const fleetToken = genToken(fleet)

export {
  public_key,
  private_key,
  adminToken,
  logisticsToken,
  warehouseToken,
  fleetToken,
}
