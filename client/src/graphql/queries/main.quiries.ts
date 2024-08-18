import { gql } from "@apollo/client";


export const USER_LIST_QUERY=gql`
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
`