// server/src/schemas/typeDefs.js
const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Collection {
    _id: ID!
    gameId: String!
    name: String!
    userId: ID!
  }

  type Query {
    me: User
    myCollection: [Collection]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addGameToCollection(gameId: String!, name: String!): Collection
    removeGameFromCollection(gameId: String!): Collection
  }
`;

export default typeDefs;