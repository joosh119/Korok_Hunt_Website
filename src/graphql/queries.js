/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      collected_koroks
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        collected_koroks
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getKorok = /* GraphQL */ `
  query GetKorok($id: ID!) {
    getKorok(id: $id) {
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
export const listKoroks = /* GraphQL */ `
  query ListKoroks(
    $filter: ModelKorokFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listKoroks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        korok_num
        pos_lat
        pos_long
        scan_history
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
