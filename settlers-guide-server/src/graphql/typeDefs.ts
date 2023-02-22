const typeDefs = `#graphql
  scalar Date

  union AdventureResult = Adventure | EntityResult
  union AdventureCategoryResult = AdventureCategory | EntityResult
  union UserResult = User | EntityResult

  type EntityResult {
      messages: [String!]
  }

  type Adventure{
    id: ID!
    name: String!
    adventureCategory: AdventureCategory
  }

  type AdventureCategory{
    id: ID!
    name: String!
    adventures: [Adventure!]
  }

  type User{
    id: ID!
    email: String!
    password: String!
    createdOn: String!
    lastModifiedOn: String!
    userName: String!
  }
  

  type Query {
    me: UserResult!
    getAdventureCategory(id: ID!): AdventureCategoryResult!
    getAdventureCategories: [AdventureCategoryResult!]
  }
  
  type Mutation {
    changePassword(newPassword: String, oldPassword: String): String!
    login(email: String, password: String): String!
    logout(email: String): String!
    register(email: String!, password: String!, passwordConfirmation: String!, userName: String!): String!
  }
`;

export default typeDefs;
