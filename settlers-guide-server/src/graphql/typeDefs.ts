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
  }
  

  type Query {
    me: UserResult!
    getAdventureCategory(id: ID!): AdventureCategoryResult!
    getAdventureCategories: [AdventureCategoryResult!]
  }
  
`;

export default typeDefs;
