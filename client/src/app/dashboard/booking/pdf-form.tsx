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
  roomName?: string; // optional, as it's for internal use
  emergencyContact: string;
  relation: string;
  emergencyContactNumber: string;
  dob: string;
  bloodGroup?: string; // optional, as it may not be provided
  healthIssue?: string; // optional, default is 'None' if not provided
  stayDuration: string;
}
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, lineHeight: 1.5 },
  header: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    borderBottomStyle: "solid",
  },
  label: { fontWeight: "bold" },
  inputField: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  inputLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginLeft: 5,
  },
  smallText: { fontSize: 9, color: "gray" },
  declaration: {
    marginTop: 20,
    fontSize: 9,
    color: "gray",
    textAlign: "justify",
  },
  footer: { textAlign: "center", marginTop: 20, fontSize: 9 },
});

const MembershipPDF = ({ formData }: { formData: FormData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>OXTEL BLOOMS - Hostel Joining Form</Text>

      {/* Section: Applicant Details */}
      <View style={styles.section}>
        <View style={styles.inputField}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.inputLine}>{formData?.date || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Applicant's Name:</Text>
          <Text style={styles.inputLine}>{formData.name || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.inputLine}>{formData.contactNumber || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>E-mail ID:</Text>
          <Text style={styles.inputLine}>{formData.email || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>ID Card Number:</Text>
          <Text style={styles.inputLine}>{formData.idCardNumber || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.inputLine}>{formData.address || ""}</Text>
        </View>
      </View>

      {/* Section: Room Preferences */}
      <View style={styles.section}>
        <View style={styles.inputField}>
          <Text style={styles.label}>Job Title:</Text>
          <Text style={styles.inputLine}>{formData.jobTitle || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Company Name:</Text>
          <Text style={styles.inputLine}>{formData.companyName || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Room Preference:</Text>
          <Text style={styles.inputLine}>{formData.roomPreference || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Room Name:</Text>
          <Text style={styles.inputLine}>
            {formData.roomName ||  "N/A"}
          </Text>
        </View>
      </View>

      {/* Section: Emergency Contact */}
      <View style={styles.section}>
        <View style={styles.inputField}>
          <Text style={styles.label}>Emergency Contact Name:</Text>
          <Text style={styles.inputLine}>
            {formData.emergencyContact || ""}
          </Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Relation:</Text>
          <Text style={styles.inputLine}>{formData.relation || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Contact No:</Text>
          <Text style={styles.inputLine}>
            {formData.emergencyContactNumber || ""}
          </Text>
        </View>
      </View>

      {/* Section: Additional Information */}
      <View style={styles.section}>
        <View style={styles.inputField}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.inputLine}>{formData.dob || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Blood Group:</Text>
          <Text style={styles.inputLine}>{formData.bloodGroup || ""}</Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>Any health issue:</Text>
          <Text style={styles.inputLine}>
            {formData.healthIssue ||  "None"}
          </Text>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.label}>How long you plan to stay:</Text>
          <Text style={styles.inputLine}>{formData.stayDuration || ""}</Text>
        </View>
      </View>

      {/* Declaration */}
      <Text style={styles.declaration}>
        I hereby acknowledge that if I vacate Oxtel Hostel without providing 15
        days prior written notice, I agree to pay one month’s rent as per the
        terms and conditions.
      </Text>

      {/* Footer */}
      <Text style={styles.footer}>Thank you for choosing Oxtel Blooms!</Text>
    </Page>
  </Document>
);

export default MembershipPDF;
