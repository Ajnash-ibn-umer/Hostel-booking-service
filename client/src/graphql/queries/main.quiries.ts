import { gql } from "@apollo/client";

export const USER_LIST_QUERY = gql`
  query UserQuery($listUserInput: ListUserInput!) {
    User_List(listUserInput: $listUserInput) {
      totalCount
      list {
        admissionFormId
        createdAt
        createdUserId
        email
        name
        password
        phoneNumber
        profileImgUrl
        roleId
        status
        updatedAt
        updatedUserId
        userNo
        userType
      }
    }
  }
`;

export const ADMIN_LOGIN_GQL = gql`
  mutation User_Admin_Login($loginAdminInput: LoginAdminInput!) {
    User_Admin_Login(loginAdminInput: $loginAdminInput) {
      message
      token
      user {
        _id
        bookingId
        createdAt
        createdUserId
        email
        name

        phoneNumber
        profileImgUrl
        roleId
        status
        updatedAt
        updatedUserId
        userNo
        userType
      }
    }
  }
`;

export const HOSTEL_LIST_DASHBOARD = gql`
  query Hostel_List($listInputHostel: ListInputHostel!) {
    Hostel_List(listInputHostel: $listInputHostel) {
      list {
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
      }
      totalCount
    }
  }
`;

export const PROPERTY_CATEGORY_LIST = gql`
  query PropertyCategory_List($listInput: ListInputCategory!) {
    PropertyCategory_List(listInput: $listInput) {
      list {
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
      totalCount
    }
  }
`;

export const LOCATION_LIST_GQL = gql`
  query Location_List($listInputLocation: ListInputLocation!) {
    Location_List(listInputLocation: $listInputLocation) {
      totalCount
      list {
        _id
        createdAt
        createdUserId
        name
        status
        updatedAt
        updatedUserId
        createdUser {
          _id
          bookingId
          createdAt
          createdUserId
          email
          name
          phoneNumber
          profileImgUrl
          roleId
          status
          updatedAt
          updatedUserId
          userNo
          userType
        }
      }
    }
  }
`;

export const LOCATION_LIST_MINIMAL_GQL = gql`
  query Location_List($listInputLocation: ListInputLocation!) {
    Location_List(listInputLocation: $listInputLocation) {
      list {
        _id
        createdAt
        name
        status
      }
    }
  }
`;

export const PROPERTY_CATEGORY_MINIMAL_LIST = gql`
  query PropertyCategory_List($listInput: ListInputCategory!) {
    PropertyCategory_List(listInput: $listInput) {
      list {
        _id
        createdAt
        name
        status
      }
    }
  }
`;

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

export const AMENITY_LIST_GQL = gql`
  query Amenity_List($listInput: ListInpuAmenity!) {
    Amenity_List(listInput: $listInput) {
      list {
        _id
        createdAt
        createdUserId
        description
        icon
        name
        slug
        status
        updatedAt
        createdUser {
          _id
          bookingId
          createdAt
          createdUserId
          email
          name
          phoneNumber
          profileImgUrl
          roleId
          status
          updatedAt
          updatedUserId
          userNo
          userType
        }
      }
      totalCount
    }
  }
`;

export const AMENITY_LIST_MINIMAL_GQL = gql`
  query Amenity_List($listInput: ListInpuAmenity!) {
    Amenity_List(listInput: $listInput) {
      list {
        _id
        createdAt
        name
        slug
        status
      }
    }
  }
`;

export const ROOM_TYPE_LIST_GQL = gql`
  query RoomType_List($listInput: ListInputRoomType!) {
    RoomType_List(listInput: $listInput) {
      totalCount
      list {
        _id
        createdAt
        createdUserId
        description
        name
        status
        updatedAt
        updatedUserId
      }
    }
  }
`;

export const ROOM_TYPE_LIST_MINIMAL_GQL = gql`
  query RoomType_List($listInput: ListInputRoomType!) {
    RoomType_List(listInput: $listInput) {
      totalCount
      list {
        _id
        createdAt
        name
        status
      }
    }
  }
`;


export const GALLERY_CREATE_GQL=gql`mutation Gallery_Create($createGalleryInput: CreateGalleryInput!) {
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
}`