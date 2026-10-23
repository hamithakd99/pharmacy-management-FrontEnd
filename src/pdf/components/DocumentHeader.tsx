import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { PharmacyDocumentSettings } from "../utils/document.types";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 7,
    paddingBottom: 7,
    borderBottomWidth: 0.8,
    borderBottomColor: "#555555",
  },
  logo: { width: 95, height: 42, objectFit: "contain", marginBottom: 3 },
  name: { fontSize: 15, fontWeight: "bold", color: "#222222", textAlign: "center", marginBottom: 3 },
  info: { fontSize: 7, color: "#333333", textAlign: "center", marginBottom: 2 },
});

interface Props { settings: PharmacyDocumentSettings }

export default function DocumentHeader({ settings }: Props) {
  return (
    <View style={styles.container}>
      {settings.logoUrl ? <Image src={settings.logoUrl} style={styles.logo} /> : null}
      {settings.address ? <Text style={styles.info}>{settings.address}</Text> : null}
      {settings.phone ? <Text style={styles.info}>Phone: {settings.phone}</Text> : null}
      {settings.email ? <Text style={styles.info}>Email: {settings.email}</Text> : null}
    </View>
  );
}
