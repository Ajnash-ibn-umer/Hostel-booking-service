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
        gps_location {
          coordinates
          type
        }
        locationLink
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

export const LOCATION_LIST_FOR_TABLE_GQL = gql`
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
        locationLink
        createdUser {
          _id
          name
          phoneNumber
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
        locationLink
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
//---------------
// AMENITY

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
// ------------------
// ROOM TYPE
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
        rentDailyLower
        rentDailyUpper
        rentMonthlyUpper
        rentMonthlyLower
        securityDepositForLower
        securityDepositForUpper
        bedCount
        updatedAt
        updatedUserId
        createdUser {
          _id
          name
          status
        }
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

export const BOOKING_LIST_GQL = gql`
  query Booking_List($dto: ListInputBooking!) {
    Booking_List(dto: $dto) {
      list {
        _id
        address
        arrivalTime
        basePrice
        bedId
        bedName
        bedPosition
        bloodGroup
        bookingNumber
        bookingStatus
        branch
        canteenFacility
        city
        companyName
        contractFrom
        contractTo
        createdAt
        createdUserId
        discountAmount
        dob
        email
        emergencyMobile
        emergencyName
        emergenyRelation
        fatherName
        grossAmount
        idCardNumber
        invoiceId
        jobTitle
        motherName
        name
        netAmount
        netAmount
        otherAmount
        phone
        propertyId
        regNo
        roomId
        securityDeposit
        selectedPaymentBase
        status
        taxAmount
        taxId
        taxPer
        totalDays
        updatedAt
        updatedUserId
        userRemark
      }
      totalCount
    }
  }
`;

export const BOOKING_LIST_MINIMAL_GQL = gql`
  query Booking_List($dto: ListInputBooking!) {
    Booking_List(dto: $dto) {
      list {
        _id
        arrivalTime
        basePrice
        checkInDate
        bedId
        bedName
        bedPosition
        netAmount
        bookingNumber
        bookingStatus
        bedPosition
        canteenFacility
        email
        name
        phone
        propertyId
        regNo
        roomId
        laudryFacility
        securityDeposit
        selectedPaymentBase
        status
        createdAt
        idProofDocUrls
        dob
        emergencyMobile
        emergencyName
        emergenyRelation
        address
        bloodGroup
        city
        companyName
        jobTitle
        userRemark
        property {
          _id
          name
          status
        }
      }
      totalCount
    }
  }
`;

export const ROOM_BED_LIST_GQL = gql`
  query Room_List($listInputRoom: ListInputRoom!) {
    Room_List(listInputRoom: $listInputRoom) {
      totalRooms
      list {
        _id
        beds {
          _id
          availabilityStatus
          bedPosition
          name
          paymentBase
          roomId
          status
        }
      }
    }
  }
`;

export const HOSTEL_DETAILS = gql`
  query Hostel_List($listInputHostel: ListInputHostel!) {
    Hostel_List(listInputHostel: $listInputHostel) {
      totalCount
      list {
        galleries {
          _id
          url
          name
        }
        amenities {
          _id
          name
          icon
        }
        name
        description
        rooms {
          _id
          slug
          galleries {
            url
            _id
            name
          }
          name
          floor
          totalBeds
          roomTypeId
          roomType {
            name
            description
            rentDailyLower
            rentDailyUpper
            rentMonthlyLower
            rentMonthlyUpper
          }
          amenities {
            name
            icon
          }
          beds {
            _id
            availabilityStatus
            bedPosition
            floor
            name
            paymentBase
            roomTypeId
          }
        }
        sellingPrice
        standardPrice
        totalRooms
        createdAt
        availabilityStatus
        locationId
        location {
          name
        }
        categoryId
        category {
          _id
          name
          slug
          status
        }
        priceBaseMode
        propertyNo

        totalBeds
      }
    }
  }
`;

export const CONTACT_LIST_FOR_TABLE_GQL = gql`
  query ContactUs_List($dto: ContactUsListInput!) {
    ContactUs_List(dto: $dto) {
      totalCount
      list {
        createdAt
        email
        message
        name
        phone
        status
      }
    }
  }
`;

export const CHECK_IN_GUEST = gql`
  query User_List($listUserInput: ListUserInput!) {
    User_List(listUserInput: $listUserInput) {
      list {
        phoneNumber
        email
        name
        isActive
        userNo
        _id
      }
      totalCount
    }
  }
`;

export const CHECK_IN_GUEST_DETAILS = gql`
  query User_List($listUserInput: ListUserInput!) {
    User_List(listUserInput: $listUserInput) {
      list {
        phoneNumber
        email
        name
        isActive
        userNo
        _id
        bookingId
        booking {
          _id
          bookingNumber
          city
          checkInDate
          canteenFacility
          userRemark
          selectedPaymentBase
          netAmount
          laudryFacility
          bloodGroup
          jobTitle
          idCardNumber
          idProofDocUrls
          emergenyRelation
          emergencyName
          emergencyMobile
          email
          dob
          companyName
          bedPosition
          address
        }
        contract {
          _id
          bedId
          propertyId
          laundryMonthlyCount
          status
          vaccatStatus
          bed {
            name
          }
          property {
            name
          }
        }
      }
      totalCount
    }
  }
`;
export const ME_ADMIN = gql`
  query User {
    User_Me {
      user {
        _id
        name
        email
      }
      message
    }
  }
`;

export const COMPLAINT_GQL = gql`
  query Complaint_List($dto: ListInputComplaint!) {
    Complaint_List(dto: $dto) {
      totalCount
      list {
        _id
        createdAt
        createdUserId
        description
        propertyId
        requestStatus
        roomId
        status
        title
        updatedAt
        updatedUserId
        userId
        property {
          name
          _id
        }
        galleries {
          _id
          name
          status
          url
        }
        room {
          _id
          name
        }
        user {
          email
          name
          _id
          userNo
        }
      }
    }
  }
`;
export const PAYMENT_LIST_GQL = gql`
  query Payment_list($listPaymentInput: ListInputPayments!) {
    Payment_list(listPaymentInput: $listPaymentInput) {
      totalCount
      list {
        _id
        createdAt
        createdUserId
        dueDate
        invoiceId
        payAmount
        payedDate
        paymentStatus
        receivedAmount
        status
        updatedAt
        updatedUserId
        userId
        voucherId
        voucherType
        user {
          name
          _id
          userNo
        }
      }
    }
  }
`;

export const CHECKOUT_REQUEST_LIST_GQL = gql`
  query CHECKOUT_REQUEST_LIST(
    $listCheckoutRequestInput: ListInputCheckoutRequest!
  ) {
    CHECKOUT_REQUEST_LIST(listCheckoutRequestInput: $listCheckoutRequestInput) {
      totalCount
      list {
        _id
        bedId
        bookingId
        checkoutApprovalStatus
        contractId
        createdAt
        createdUserId
        description
        guestId
        guestNo
        hostelId
        roomId
        status
        updatedAt
        updatedUserId
        vaccatingDate
        bed {
          _id
          name
        }
        guest {
          _id
          name
          email
        }
      }
    }
  }
`;

export const DAMAGE_AND_SPLIT_LIST_QUERY = gql`
  query DamageAndSplitList($dto: ListInputDamageAndSpit!) {
    DamageAndSplit_List(dto: $dto) {
      totalCount
      list {
        title
        totalAmount
        dueDate
        status
        receivedAmount
        amountStatus
        hostelId
        splitDetails {
          _id
          amount
          userId
          payed
          user {
            name
          }
        }
        hostel {
          _id
          name
        }
      }
    }
  }
`;


export const LaundryBooking_List= gql`
query List($listInputLaundryBooking: ListInputLaundryBooking!) {
  LaundryBooking_List(listInputLaundryBooking: $listInputLaundryBooking) {
    list {
      _id
      bookingDate
      bookingType
      createdAt
      requestStatus
      createdUser {
        name
      }
      hostel {
        name
      }
    }
  }
}
`