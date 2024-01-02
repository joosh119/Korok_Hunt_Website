/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      email
      collected_koroks
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      email
      collected_koroks
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      email
      collected_koroks
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateKorok = /* GraphQL */ `
  subscription OnCreateKorok($filter: ModelSubscriptionKorokFilterInput) {
    onCreateKorok(filter: $filter) {
      id
      korok_num
      pos_lat
      pos_long
      scan_history
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateKorok = /* GraphQL */ `
  subscription OnUpdateKorok($filter: ModelSubscriptionKorokFilterInput) {
    onUpdateKorok(filter: $filter) {
      id
      korok_num
      pos_lat
      pos_long
      scan_history
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteKorok = /* GraphQL */ `
  subscription OnDeleteKorok($filter: ModelSubscriptionKorokFilterInput) {
    onDeleteKorok(filter: $filter) {
      id
      korok_num
      pos_lat
      pos_long
      scan_history
      createdAt
      updatedAt
      __typename
    }
  }
`;
