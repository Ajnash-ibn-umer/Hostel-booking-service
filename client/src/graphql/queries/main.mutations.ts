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

export const HOSTEL_UPDATE_GQL = gql`
  mutation Hostel_Update($updateHostelInput: UpdateHostelInput!) {
    Hostel_Update(updateHostelInput: $updateHostelInput) {
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
  }
`;

export const COMPLAINT_APPROVAL_STATUS_CHANGE = gql`
  mutation Complaint_UpdateApprovalStatus(
    $updateApprovalStatusInput: UpdateComplaintApprovalStatus!
  ) {
    Complaint_UpdateApprovalStatus(
      updateApprovalStatusInput: $updateApprovalStatusInput
    ) {
      _id
    }
  }
`;

export const CREATE_DAMAGE_AND_SPLITS = gql`
  mutation DamageAndSplit_Create(
    $createDamageAndSplitInput: CreateDamageAndSplitInput!
  ) {
    DamageAndSplit_Create(
      createDamageAndSplitInput: $createDamageAndSplitInput
    ) {
      _id
      amountStatus
      createdAt
      createdUserId
      description
      documentUrl
      dueDate
      hostel {
        _id
      }
      hostelId
      receivedAmount
      splitDetails {
        _id
        amount
      }
      status
      title
      totalAmount
      updatedAt
    }
  }
`;
export const HOSTEL_LIST = gql`
  query Hostel_List($listInputHostel: ListInputHostel!) {
    Hostel_List(listInputHostel: $listInputHostel) {
      list {
        _id
        name
      }
    }
  }
`;

export const USER_LIST = gql`
  query User_List($listUserInput: ListUserInput!) {
    User_List(listUserInput: $listUserInput) {
      list {
        _id
        name
      }
    }
  }
`;

export const PAYMENT_PAY_APPROVAL = gql`
  mutation Payment_Approval(
    $updatePaymentApprovalStatus: UpdatePaymentApprovalStatus!
  ) {
    Payment_Approval(
      updatePaymentApprovalStatus: $updatePaymentApprovalStatus
    ) {
      message
    }
  }
`;

export const CHECKOUT_REQUEST_STATUS_UPDATE = gql`
  mutation CHECKOUT_REQUEST_UPDATE_STATUS(
    $updateCheckoutInput: UpdateCHeqoutRequestApprovalStatus!
  ) {
    CHECKOUT_REQUEST_UPDATE_STATUS(updateCheckoutInput: $updateCheckoutInput) {
      message
    }
  }
`;

export const CHECKOUT_FORCED = gql`
  mutation CHECKOUT_REQUEST_CHECKOUT(
    $forcedCheckoutInput: ForcedCheckoutInput!
  ) {
    CHECKOUT_REQUEST_CHECKOUT(forcedCheckoutInput: $forcedCheckoutInput) {
      message
    }
  }
`;

export const PAYMENT_ORDER_CREATION = gql`
  mutation Payment_gateway_Order_Create($orderInput: CreateOrderInput!) {
    Payment_gateway_Order_Create(orderInput: $orderInput) {
      order_id
      order_status
    }
  }
`;

export const PAYMENT_VERIFICATION = gql`
  mutation Verify_Payment_Gateway_Order(
    $verifyPaymentGatewayInput: VerifyPaymentGatewayInput!
  ) {
    Verify_Payment_Gateway_Order(
      VerifyPaymentGatewayInput: $verifyPaymentGatewayInput
    ) {
      message
      payedAmount
      status
      transactionDate
      transactionId
    }
  }
`;
