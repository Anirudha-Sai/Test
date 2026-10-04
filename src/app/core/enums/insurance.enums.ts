export enum Role {
  User = 'User',
  Customer = 'Customer',
  Agent = 'Agent',
  Underwriter = 'Underwriter',
  ClaimManager = 'ClaimManager',
  Admin = 'Admin'
}

export enum AssetType {
  ResidentialProperty = 1,
  CommercialProperty = 2,
  Vehicle = 3
}

export enum ConstructionType {
  BrickMasonry = 0,
  ReinforcedConcrete = 1,
  SteelFrame = 2,
  Wood = 3,
  Mixed = 4
}

export enum OccupancyType {
  OwnerOccupied = 0,
  TenantOccupied = 1,
  Commercial = 2,
  Industrial = 3,
  Vacant = 4
}

export enum QuoteStatus {
  Requested = 1,
  Generated = 2,
  CustomerSelected = 3,
  Approved = 4,
  Rejected = 5,
  Expired = 6,
  ConvertedToPolicy = 7
}

export enum PolicyStatus {
  Draft = 1,
  Active = 2,
  Expired = 3,
  Suspended = 4,
  Cancelled = 5,
  ClaimInProgress = 6
}

export enum ProductType {
  Residential = 1,
  Commercial = 2,
  Vehicle = 3
}
