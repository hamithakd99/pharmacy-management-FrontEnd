
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { PharmacyDocumentSettings } from "../utils/document.types";

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#555555",
    },

    logo: {
        width: 170,
        height: 60,
        objectFit: "contain",
        marginBottom: 3,
    },

    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111111",
        textAlign: "center",
        marginBottom: 5,
    },

    info: {
        fontSize: 9,
        color: "#222222",
        textAlign: "center",
        marginBottom: 4,
        lineHeight: 1,
    },

    address: {
        fontSize: 9,
        fontWeight: "medium",
        color: "#222222",
        textAlign: "center",
        marginBottom: 5,
        lineHeight: 1,
    },
});

interface Props {
    settings: PharmacyDocumentSettings;
}

export default function DocumentHeader({ settings }: Props) {
    return (
        <View style={styles.container}>
            {settings.logoUrl ? (
                <Image
                    src={settings.logoUrl}
                    style={styles.logo}
                />
            ) : null}

            {settings.address ? (
                <Text style={styles.address}>
                    {settings.address}
                </Text>
            ) : null}

            {settings.phone ? (
                <Text style={styles.info}>
                    Phone: {settings.phone}
                </Text>
            ) : null}

            {settings.email ? (
                <Text style={styles.info}>
                    Email: {settings.email}
                </Text>
            ) : null}
        </View>
    );
}
