import { gql } from "@apollo/client";

export const CATEGORY_CREATE_GQL = gql`
  mutation PropertyCategory_Create(
    $createPropertyCategoryInput: CreatePropertyCategoryInput!
  ) {
    PropertyCategory_Create(
      createPropertyCategoryInput: $createPropertyCategoryInput
    ) {
      description
      icon
      name
      slug
    }
  }
`;
export const CATEGORY_DELETE_GQL = gql`
  mutation PropertyCategory_StatusChange(
    $statusChangeInput: statusChangeInput!
  ) {
    PropertyCategory_StatusChange(statusChangeInput: $statusChangeInput) {
      message
    }
  }
`;
export const CATEGORY_UPDATE_GQL = gql`
  mutation PropertyCategory_Update(
    $updatePropertyCategoryInput: UpdatePropertyCategoryInput!
  ) {
    PropertyCategory_Update(
      updatePropertyCategoryInput: $updatePropertyCategoryInput
    ) {
      _id
    }
  }
`;

export const HOSTEL_CREATE_GQL = gql`
  mutation Hostel_Create($createHostelInput: CreateHostelInput!) {
    Hostel_Create(createHostelInput: $createHostelInput) {
      _id
      availabilityStatus
      categoryId
      createdAt
      createdUserId
      description
      locationId
      name
      priceBaseMode
      propertyNo
      sellingPrice
      shortDescription
      slug
      standardPrice
      status
      totalBeds
      totalRooms
      updatedAt
      updatedUserId
    }
  }
`;

export const HOSTEL_DELETE_GQL = gql`
  mutation Hostel_StatusChange($statusChangeInput: statusChangeInput!) {
    Hostel_StatusChange(statusChangeInput: $statusChangeInput) {
      message
    }
  }
`;

export const GALLERY_CREATE_GQL = gql`
  mutation Gallery_Create($createGalleryInput: CreateGalleryInput!) {
    Gallery_Create(createGalleryInput: $createGalleryInput) {
      _id
      createdAt
      createdUserId
      docType
      name
      status
      uid
      updatedAt
      updatedUserId
      url
    }
  }
`;

export const GALLERY_CREATE_MULTIPLE_GQL = gql`
  mutation Gallery_Multi_Create(
    $createGalleryInput: CreateGalleryMultipleInput!
  ) {
    Gallery_Multi_Create(createGalleryInput: $createGalleryInput) {
      _id
      createdAt
      createdUserId
      docType
      name
      status
      uid
      updatedAt
      updatedUserId
      url
    }
  }
`;

export const LOCATION_CREATE_GQL = gql`
  mutation Location_Create($createLocationInput: CreateLocationInput!) {
    Location_Create(createLocationInput: $createLocationInput) {
      _id
      createdAt
    }
  }
`;

export const LOCATION_DELETE_GQL = gql`
  mutation Location_StatusChange($statusChangeInput: statusChangeInput!) {
    Location_StatusChange(statusChangeInput: $statusChangeInput) {
      message
    }
  }
`;

export const LOCATION_UPDATE_GQL = gql`
  mutation Location_Update($updateLocationInput: UpdateLocationInput!) {
    Location_Update(updateLocationInput: $updateLocationInput) {
      _id
    }
  }
`;

// AMENITY
export const AMENITY_CREATE_GQL = gql`
  mutation Amenity_Create($createAmenityInput: CreateAmenityInput!) {
    Amenity_Create(createAmenityInput: $createAmenityInput) {
      _id
      createdAt
      createdUserId
      description
      icon
      name
      slug
      status
      updatedAt
      updatedUserId
    }
  }
`;

export const AMENITY_UPDATE_GQL = gql`
  mutation Amenity_Update($updateAmenityInput: UpdateAmenityInput!) {
    Amenity_Update(updateAmenityInput: $updateAmenityInput) {
      _id
      createdAt
      createdUserId
      description
      icon
      name
      slug
    }
  }
`;

export const AMENITY_DELETE_GQL = gql`
  mutation Amenity_StatusChange($statusChangeInput: statusChangeInput!) {
    Amenity_StatusChange(statusChangeInput: $statusChangeInput) {
      message
    }
  }
`;

// ROOMTYPE
export const ROOM_TYPE_CREATE_GQL = gql`
  mutation RoomType_Create($createRoomTypeInput: CreateRoomTypeInput!) {
    RoomType_Create(createRoomTypeInput: $createRoomTypeInput) {
      _id
      bedCount
      createdAt
      createdUserId
      description
      name
      rentDailyLower
      rentDailyUpper
      rentMonthlyLower
      rentMonthlyUpper
      securityDepositForLower
      securityDepositForUpper
    }
  }
`;

export const ROOM_TYPE_UPDATE_GQL = gql`
  mutation RoomType_Update($updateRoomTypeInput: UpdateRoomTypeInput!) {
    RoomType_Update(updateRoomTypeInput: $updateRoomTypeInput) {
      _id
    }
  }
`;

export const ROOM_TYPE_DELETE_GQL = gql`
  mutation RoomType_StatusChange($statusChangeInput: statusChangeInput!) {
    RoomType_StatusChange(statusChangeInput: $statusChangeInput) {
      message
    }
  }
`;

export const BOOKING_STATUS_CHANGE = gql`
mutation Booking_ApprovalStatusChange($dto: AdminBookingStatusChangeInput!) {
  Booking_ApprovalStatusChange(dto: $dto) {
    message
  }
}`;
