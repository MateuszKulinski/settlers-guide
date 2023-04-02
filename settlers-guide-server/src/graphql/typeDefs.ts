const typeDefs = `#graphql
  scalar Date

  union AdventureResult = Adventure | EntityResult
  union AdventureCategoryResult = AdventureCategory | EntityResult
  union AdventureCategoryArrayResult = AdventureCategoryArray | EntityResult
  union GeneralArrayResult = GeneralArray | EntityResult
  union GuideArrayResult = GuideArray | EntityResult
  union GeneralTypeArrayResult = GeneralTypeArray | EntityResult
  union GeneralUpgradeTypeArrayResult = GeneralUpgradeArrayType | EntityResult
  union UserResult = User | EntityResult

  type EntityResult {
      messages: [String!]
  }

  type GeneralArray {
    generals: [General!]
  }  

  type GuideArray {
    guides: [Guide!]
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

  type Image{
    id: String!
    fileName: String!
    guide: Guide
    guideAttack: GuideAttack
  }

  type GuideAttack{
    description: String!
  }

  type Guide{
    id: String!
    name: String!
    description: String
    type: Int!
    adventure: Adventure!
    lastModifiedOn: Date!
    user: User
    image: Image
  }

  type General{
    id: String!
    name: String!
    generalType: GeneralType!
    upgrades: [GeneralUpgrade!]
    public: Boolean
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
    getGenerals(id:ID, withPublic:Boolean): GeneralArrayResult!
    getGeneralUpgradeTypes: GeneralUpgradeTypeArrayResult!
    getGuides(id:ID): GuideArrayResult!
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
    joinItemImage(type: Int!, itemId: String!, imgId: String!): Boolean
    removeImage(type: Int!, itemId: String!, imgId: String!): Boolean
    deleteGeneral(generalId: ID!): Boolean
    deleteGuide(guideId: ID!): Boolean
    changePassword(newPassword: String, oldPassword: String): String!
    login(email: String, password: String): String!
    logout(email: String): String!
    register(email: String!, password: String!, passwordConfirmation: String!, userName: String!): String!
  }
`;
export default typeDefs;
