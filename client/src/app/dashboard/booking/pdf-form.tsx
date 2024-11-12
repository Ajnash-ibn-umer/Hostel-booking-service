import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  titleHostel: {
    color: "#000859",
  },
  titleJoining: {
    color: "#ff8c00",
  },
  subtitle: {
    fontSize: 11,
    backgroundColor: "#000859",
    borderRadius: 5,
    color: "white",
    padding: 8,
    marginBottom: 5,
    textAlign: "center",
  },
  section: {
    borderRadius: 5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottom: "0.75 solid #000859",
  },
  lastRow: {
    flexDirection: "column",
    gap: 5,
    borderBottom: "none",
    borderRadius: 5,
    overflow: "hidden",
  },
  column: {
    flex: 1,
    flexDirection: "row",
  },
  label: {
    width: 120,
    fontSize: 10,
    fontWeight: "bold",
    padding: 6,
    color: "#000859",
    backgroundColor: "#e2e4ed",
  },
  field: {
    flex: 1,
    fontSize: 10,
    padding: 6,
    backgroundColor: "#f0f2f8",
  },
  fullWidthLabel: {
    width: 120,
    fontSize: 10,
    fontWeight: "bold",
    padding: 6,
    color: "#000859",
    backgroundColor: "#e2e4ed",
  },
  fullWidthField: {
    flex: 1,
    fontSize: 10,
    padding: 6,
    backgroundColor: "#f0f2f8",
  },
  emergencySection: {
    marginTop: 20,
  },
  healthSection: {
    marginTop: 20,
  },
  textArea: {
    height: 100,
    fontSize: 10,
    padding: 6,
    marginTop: 20,
    backgroundColor: "#f0f2f8",
    width: "100%",
  },
  noBorderBottom: {
    borderBottom: "none",
  },
});

const MembershipPDF = ({ formData }: { formData: FormData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>
          <Text style={styles.titleHostel}>HOSTEL </Text>
          <Text style={styles.titleJoining}>JOINING FORM</Text>
        </Text>

        <Text style={styles.subtitle}>
          TO APPLY FOR MEMBERSHIP PLEASE COMPLETE ALL QUESTIONS.
        </Text>

        <View style={styles.section}>
          {/* Personal Information */}
          <View style={styles.row}>
            <Text style={styles.fullWidthLabel}>Applicants Name</Text>
            <Text style={styles.fullWidthField}>{formData.name || ""}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.field}>{formData.contactNumber || ""}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>ID Card Number</Text>
              <Text style={styles.field}>{formData.idCardNumber || ""}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.fullWidthLabel}>E-Mail</Text>
            <Text style={styles.fullWidthField}>{formData.email || ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.fullWidthLabel}>Address</Text>
            <Text style={styles.fullWidthField}>{formData.address || ""}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Job Title</Text>
              <Text style={styles.field}>{formData.jobTitle || ""}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Company Name</Text>
              <Text style={styles.field}>{formData.companyName || ""}</Text>
            </View>
          </View>

          <View style={[styles.row, styles.noBorderBottom]}>
            <View style={styles.column}>
              <Text style={styles.label}>Room Preference</Text>
              <Text style={styles.field}>{formData.roomPreference || ""}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Room Name</Text>
              <Text style={styles.field}>{formData.roomName || ""}</Text>
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencySection}>
          <Text style={styles.subtitle}>EMERGENCY CONTACT NAME</Text>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.field}>
                  {formData.emergencyContact || ""}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Contact No</Text>
                <Text style={styles.field}>
                  {formData.emergencyContactNumber || ""}
                </Text>
              </View>
            </View>

            <View style={[styles.row, styles.noBorderBottom]}>
              <Text style={styles.fullWidthLabel}>Relation</Text>
              <Text style={styles.fullWidthField}>
                {formData.relation || ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Health Information */}
        <View style={styles.healthSection}>
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Date of Birth</Text>
                <Text style={styles.field}>{formData.dob || ""}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Blood Group</Text>
                <Text style={styles.field}>{formData.bloodGroup || ""}</Text>
              </View>
            </View>

            <View style={[styles.row, styles.noBorderBottom]}>
              <Text style={styles.fullWidthLabel}>Any health issue</Text>
              <Text style={styles.fullWidthField}>
                {formData.healthIssue || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.lastRow, styles.textArea]}>
            <Text>How long are you planning to stay?</Text>
            <Text>{formData.stayDuration || ""}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default MembershipPDF;
