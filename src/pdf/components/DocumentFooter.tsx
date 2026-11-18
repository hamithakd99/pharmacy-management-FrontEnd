
import {
    View,
    Text,
    StyleSheet,
} from "@react-pdf/renderer";

import type { PharmacyDocumentSettings } from "../utils/document.types";

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        alignItems: "center",
    },

    message: {
        fontSize: 9,
        color: "#334155",
        textAlign: "center",
        marginBottom: 7,
    },

    software: {
        fontSize: 7,
        color: "#64748B",
        textAlign: "center",
        marginBottom: 3,
    },

    developer: {
        fontSize: 7,
        fontWeight: "bold",
        color: "#073B4C",
        textAlign: "center",
    },
});

interface Props {
    settings: PharmacyDocumentSettings;
}

export default function DocumentFooter({ settings }: Props) {
    const footerMessage = settings.footerMessage?.trim();

    if (!footerMessage) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.message}>
                {footerMessage}
            </Text>

            <Text style={styles.software}>
                Powered by Pharmacy Management System
            </Text>

            <Text style={styles.developer}>
                Developed by Hamitha Apsara
            </Text>
        </View>
    );
}
