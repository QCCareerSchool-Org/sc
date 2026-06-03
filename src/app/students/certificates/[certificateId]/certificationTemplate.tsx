import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#fff' },
  title: { fontSize: 32, textAlign: 'center', marginBottom: 20 },
  name: { fontSize: 24, textAlign: 'center', fontWeight: 'bold' },
});

// Your certificate template
const CertificateTemplate = ({ name, courseName, id }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.title}>Award of Excellence</Text>
      <Text style={styles.name}>{name}</Text>
      <Text>For completing {courseName}</Text>
      <Text>Certificate ID: {id}</Text>
    </Page>
  </Document>
);

// In your page component, replace the download button with:
  <PDFDownloadLink
  document={<CertificateTemplate name={certificate.name} courseName={certificate.courseName} id={certificate.id} />}
  fileName={`certificate-${certificate.id}.pdf`}
>
  {({ loading }) => (loading ? 'Generating...' : 'Download Official PDF')}
</PDFDownloadLink>;
