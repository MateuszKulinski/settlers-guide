const typeDefs = `#graphql
  scalar Date

  union AdventureResult = Adventure | EntityResult
  union AdventureCategoryResult = AdventureCategory | EntityResult
  union AdventureCategoryArrayResult = AdventureCategoryArray | EntityResult
  union GeneralArrayResult = GeneralArray | EntityResult
  union GeneralTypeArrayResult = GeneralTypeArray | EntityResult
  union GeneralUpgradeTypeArrayResult = GeneralUpgradeArrayType | EntityResult
  union UserResult = User | EntityResult

  type EntityResult {
      messages: [String!]
  }

  type GeneralArray {
    generals: [General!]
  }

  type GeneralTypeArray{
    types: [GeneralType!]
  }

  type AdventureCategoryArray{
    categories: [AdventureCategory]
  }

  type GeneralUpgradeArrayType{
    upgradeTypes: [GeneralUpgradeType]
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

  type General{
    id: String!
    name: String!
    generalType: GeneralType!
    upgrades: [GeneralUpgrade!]
  }

  type GeneralType{
    id: ID!
    name: String!
  }

  type GeneralUpgrade {
    id: ID!
    level: Int!
    upgradeType: GeneralUpgradeType!
  }

  input GeneralUpgradeInput {
    level: Int!
    upgradeType: ID!
  }

  type GeneralUpgradeType{
    id: ID!
    name: String!
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
    getAdventureCategories: AdventureCategoryArrayResult!
    getGeneralTypes: GeneralTypeArrayResult!
    getGenerals(id:ID): GeneralArrayResult!
    getGeneralUpgradeTypes: GeneralUpgradeTypeArrayResult!
  }
  
  type Mutation {
    saveGeneral(
      generalId: ID
      name: String!
      generalType: ID!
      upgrades: [GeneralUpgradeInput!]
    ): String!
    addGuide(
      name: String!
      description: String
      type: Int!
      adventureId: ID!
    ): String!
    deleteGeneral(generalId: ID!): Boolean
    changePassword(newPassword: String, oldPassword: String): String!
    login(email: String, password: String): String!
    logout(email: String): String!
    register(email: String!, password: String!, passwordConfirmation: String!, userName: String!): String!
  }
`;

export default typeDefs;
