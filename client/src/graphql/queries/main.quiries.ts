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

export const HOSTEL_LIST_DASHBOARD=gql`
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
}`