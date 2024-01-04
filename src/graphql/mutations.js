/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      collected_koroks
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      collected_koroks
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      collected_koroks
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const createKorok = /* GraphQL */ `
  mutation CreateKorok(
    $input: CreateKorokInput!
    $condition: ModelKorokConditionInput
  ) {
    createKorok(input: $input, condition: $condition) {
      id
      korok_num
      pos_lat
      pos_long
      scan_history
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateKorok = /* GraphQL */ `
  mutation UpdateKorok(
    $input: UpdateKorokInput!
    $condition: ModelKorokConditionInput
  ) {
    updateKorok(input: $input, condition: $condition) {
      id
      korok_num
      pos_lat
      pos_long
      scan_history
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteKorok = /* GraphQL */ `
  mutation DeleteKorok(
    $input: DeleteKorokInput!
    $condition: ModelKorokConditionInput
  ) {
    deleteKorok(input: $input, condition: $condition) {
      id
      korok_num
      pos_lat
      pos_long
      scan_history
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
