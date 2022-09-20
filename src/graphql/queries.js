/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getContacts = /* GraphQL */ `
  query GetContacts($id: ID!) {
    getContacts(id: $id) {
      id
      name
      phoneNumber
      email
      createdAt
      updatedAt
    }
  }
`;
export const listContacts = /* GraphQL */ `
  query ListContacts(
    $filter: ModelContactsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        phoneNumber
        email
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
