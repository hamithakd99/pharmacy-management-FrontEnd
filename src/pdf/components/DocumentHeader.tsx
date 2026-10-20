import {
    View,
    Text,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";

import type { PharmacyDocumentSettings } from "../utils/document.types";

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 22,
        paddingBottom: 18,
        borderBottomWidth: 2,
        borderBottomColor: "#2563EB",
    },
    logo: {
        width: 250,
        height: 110,
        objectFit: "contain",
        marginBottom: 8,
    },
    name: {
        fontSize: 21,
        fontWeight: "bold",
        color: "#163A70",
        textAlign: "center",
        marginBottom: 6,
    },
    info: {
        fontSize: 9,
        color: "#5B6472",
        textAlign: "center",
        marginBottom: 3,
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
                <Text style={styles.info}>
                    {settings.address}
                </Text>
            ) : null}

            {settings.phone ? (
                <Text style={styles.info}>
                    Tel: {settings.phone}
                </Text>
            ) : null}

            {settings.email ? (
                <Text style={styles.info}>
                    {settings.email}
                </Text>
            ) : null}
        </View>
    );
}