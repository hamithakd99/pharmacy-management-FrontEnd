import {
    View,
    Text,
    StyleSheet,
} from "@react-pdf/renderer";

import type { PharmacyDocumentSettings } from "../utils/document.types";

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        alignItems: "center",
    },
    message: {
        fontSize: 8,
        color: "#64748B",
        textAlign: "center",
    },
});

interface Props {
    settings: PharmacyDocumentSettings;
}

export default function DocumentFooter({ settings }: Props) {
    if (!settings.footerMessage) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.message}>
                {settings.footerMessage}
            </Text>
        </View>
    );
}