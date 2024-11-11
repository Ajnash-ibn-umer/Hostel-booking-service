import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

export interface FormData {
  date: string;
  name: string;
  contactNumber: string;
  email: string;
  idCardNumber: string;
  address: string;
  jobTitle: string;
  companyName: string;
  roomPreference: string;
  roomName?: string;
  emergencyContact: string;
  relation: string;
  emergencyContactNumber: string;
  dob: string;
  bloodGroup?: string;
  healthIssue?: string;
  stayDuration: string;
}

// Colors scheme for PDF
const primaryColor = "#000859";
const secondaryColor = "#EC8305";
const lightGray = "#F1F2F7";
const darkGray = "#D9DBEB";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    color: primaryColor,
    fontWeight: "black",
    marginBottom: 10,
  },
  subHeader: {
    borderRadius: 5,
    backgroundColor: primaryColor,
    color: "#fff",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    padding: 5,
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    // marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: primaryColor,
    borderBottomStyle: "solid",
  },
  label: {
    width: "20%",
    fontWeight: "bold",
    color: primaryColor,
    backgroundColor: darkGray,
  },
  inputField: {
    backgroundColor: lightGray,
    width: "80%",
    fontSize: 10,
    paddingVertical: 2,
  },
});

const MembershipPDF = ({ formData }: { formData: FormData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ ...styles.header, color: primaryColor }}>
          HOSTEL
        </Text>
        <Text
          style={{
            ...styles.header,
            color: secondaryColor,
            marginLeft: 5,
          }}
        >
          JOINING FORM
        </Text>
      </View>

      {/* Instructions */}
      <Text style={styles.subHeader}>
        TO APPLY FOR MEMBERSHIP PLEASE COMPLETE ALL QUESTIONS.
      </Text>

      {/* Section: Applicant Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Applicant's Name:</Text>
          <Text style={styles.inputField}>{formData.name || ""}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.inputField}>{formData.contactNumber || ""}</Text>
          {/* <Text style={styles.label}>ID Card Number:</Text>
          <Text style={styles.inputField}>{formData.idCardNumber || ""}</Text> */}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-Mail:</Text>
          <Text style={styles.inputField}>{formData.email || ""}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.inputField}>{formData.address || ""}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Job Title:</Text>
          <Text style={styles.inputField}>{formData.jobTitle || ""}</Text>
          <Text style={styles.label}>Company Name:</Text>
          <Text style={styles.inputField}>{formData.companyName || ""}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Room Preference:</Text>
          <Text style={styles.inputField}>{formData.roomPreference || ""}</Text>
          <Text style={styles.label}>Room Name:</Text>
          <Text style={styles.inputField}>{formData.roomName || "N/A"}</Text>
        </View>
      </View>

      {/* Emergency Contact */}
      <Text style={styles.subHeader}>EMERGENCY CONTACT NAME</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.inputField}>
            {formData.emergencyContact || ""}
          </Text>
          <Text style={styles.label}>Contact No:</Text>
          <Text style={styles.inputField}>
            {formData.emergencyContactNumber || ""}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Relation:</Text>
          <Text style={styles.inputField}>{formData.relation || ""}</Text>
        </View>
      </View>

      {/* Additional Information */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.inputField}>{formData.dob || ""}</Text>
          <Text style={styles.label}>Blood Group:</Text>
          <Text style={styles.inputField}>{formData.bloodGroup || ""}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Any health issue:</Text>
          <Text style={styles.inputField}>
            {formData.healthIssue || "None"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>How long you plan to stay:</Text>
          <Text style={styles.inputField}>{formData.stayDuration || ""}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default MembershipPDF;
