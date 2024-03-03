export interface ApartmentAd {
    Id: string;
    Category: string;
    OperationType: string;
    DateBegin: string;
    DateEnd: string;
    Address: string;
    Description: string;
    Price: string;
    Status: string;
    Renovation: string;
    RoomType: { Option: string };
    ContactPhone: string;
    Images: { Image: { url: string }[] };
    Rooms: string;
    Square: string;
    KitchenSpace: string;
    Floor: string;
    Floors: string;
    HouseType: string;
    PropertyRights: string;
    LeaseType: string;
    LeaseAdditionally: { Option: string };
    ChildrenAllowed: string;
    PetsAllowed: string;
    SmokingAllowed: string;
    PartiesAllowed: string;
    Documents: string;
    LeaseCommissionSize: string;
    LeaseDeposit: string;
    UtilityMeters: string;
    OtherUtilities: string;
    OtherUtilitiesPayment: string;
}


export interface CommercialPropertyAd {
    Id: string;
    Category: string;
    OperationType: string;
    DateBegin: string;
    DateEnd: string;
    Address: string;
    Latitude: string;
    Longitude: string;
    Title: string;
    Description: string;
    Price: string;
    PriceType: string;
    CompanyName: string;
    ManagerName: string;
    Entrance: string;
    Layout: { option: string };
    BuildingType: string;
    ContactPhone: string;
    Images: { Image: { url: string }[] };
    Square: string;
    Floor: string;
    Floors: string;
    ObjectType: string;
    ParkingType: string;
    PropertyRights: string;
    LeaseCommissionSize: string;
    LeaseDeposit: string;
    RentalType: string;
    Decoration: string;
}


export interface LandAd {
    Id: string;
    Category: string;
    OperationType: string;
    DateBegin: string;
    DateEnd: string;
    Address: string;
    Latitude: string;
    Longitude: string;
    Description: string;
    Price: string;
    CompanyName: string;
    ManagerName: string;
    ContactPhone: string;
    Images: { Image: { url: string }[] };
    LandArea: string;
    ObjectType: string;
    PropertyRights: string;
}

export interface HouseAd {
    Id: string;
    Category: string;
    OperationType: string;
    DateBegin: string;
    DateEnd: string;
    Address: string;
    Latitude: string;
    Longitude: string;
    Description: string;
    Price: string;
    CompanyName: string;
    ManagerName: string;
    BuiltYear: string;
    Renovation: string;
    LandStatus: string;
    SaleOptions: { Option: string }[];
    ContactPhone: string;
    Images: { Image: { url: string }[] };
    Rooms: string;
    Square: string;
    LandArea: string;
    Floors: string;
    WallsType: string;
    ObjectType: string;
    HouseServices: { Option: string }[];
    PropertyRights: string;
}
