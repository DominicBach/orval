/*
 * Generated by orval v5.4.10 🍺
 * Do not edit manually.
 * Swagger Petstore
 * OpenAPI spec version: 1.0.0
 */
import type {
  Pets,
  ListPetsParams,
  CreatePetsBody,
  Pet
} from '../model'
import { customInstance } from '../mutator/custom-instance'

type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;


  export const getSwaggerPetstore = () => {
const listPets = <TData = Pets>(
    params?: ListPetsParams,
    version= 1,
 options?: SecondParameter<typeof customInstance>) => {
      return customInstance<TData>(
      {url: `/v${version}/pets`, method: 'get',
        params,
    },
      // eslint-disable-next-line
// @ts-ignore
 options);
    }
  const createPets = <TData = unknown>(
    createPetsBody: CreatePetsBody,
    version= 1,
 options?: SecondParameter<typeof customInstance>) => {
      return customInstance<TData>(
      {url: `/v${version}/pets`, method: 'post',
      data: createPetsBody
    },
      // eslint-disable-next-line
// @ts-ignore
 options);
    }
  const showPetById = <TData = Pet>(
    petId: string,
    version= 1,
 options?: SecondParameter<typeof customInstance>) => {
      return customInstance<TData>(
      {url: `/v${version}/pets/${petId}`, method: 'get'
    },
      // eslint-disable-next-line
// @ts-ignore
 options);
    }
  return {listPets,createPets,showPetById}};
