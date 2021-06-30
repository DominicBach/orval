/*
 * Generated by orval v5.4.10 🍺
 * Do not edit manually.
 * Swagger Petstore
 * OpenAPI spec version: 1.0.0
 */
import {
  rest
} from 'msw'
import faker from 'faker'
import type {
  Pets,
  Pet
} from '../model'

export const getListPetsMock = () => (faker.helpers.randomize([[...Array(faker.datatype.number({min: 1, max: 10}))].map(() => ({id: (() => faker.datatype.number({ min: 1, max: 99999 }))(), name: (() => faker.name.lastName())(), tag: (() => faker.name.lastName())()})), {code: faker.datatype.number(), message: faker.random.word()}]))

export const getCreatePetsMock = () => (faker.helpers.randomize([undefined, {code: faker.datatype.number(), message: faker.random.word()}]))

export const getShowPetByIdMock = () => ((() => ({
								id: faker.datatype.number({ min: 1, max: 99 }),
								name: faker.name.firstName(),
								tag: faker.helpers.randomize([faker.datatype.string(), undefined])
							}))())

export const getSwaggerPetstoreMSW = () => [
rest.get('*/v:version/pets', (req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getListPetsMock()),
        )
      }),rest.post('*/v:version/pets', (req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getCreatePetsMock()),
        )
      }),rest.get('*/v:version/pets/:petId', (req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getShowPetByIdMock()),
        )
      }),]
