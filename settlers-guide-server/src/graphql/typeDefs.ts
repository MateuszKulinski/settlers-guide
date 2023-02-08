const typeDefs = `#graphql
  scalar Date

  type EntityResult {
      messages: [String!]
  }

  type User{
    id: ID!
    email: String!
    password: String!
    createdOn: String!
    lastModifiedOn: String!
  }
  
  union UserResult = User | EntityResult

  type Query {
    me: UserResult!
  }
`;

export default typeDefs;
