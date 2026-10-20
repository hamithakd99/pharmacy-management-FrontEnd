
import { useState, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";

import {
    Box,
    Button,
    Dialog,
    Flex,
    Text,
} from "@chakra-ui/react";

import { pdf, PDFViewer } from "@react-pdf/renderer";

import PharmacyDetailsForm from "./PharmacyDetailsForm";

import useDocumentSettings from "../../pdf/hooks/useDocumentSettings";

import type {
    PharmacyDocumentSettings,
} from "../../pdf/utils/document.types";
import toast from "react-hot-toast";

interface DocumentPreviewDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    fileName: string;
    renderDocument: (
        settings: PharmacyDocumentSettings
    ) => ReactElement<DocumentProps>;
}

export default function DocumentPreviewDialog({
    open,
    onClose,
    title,
    fileName,
    renderDocument,
}: DocumentPreviewDialogProps) {
    const { settings, updateSetting } =
        useDocumentSettings();

    const [downloading, setDownloading] = useState(false);

    async function handleDownload() {
        try {
            setDownloading(true);

            const blob = await pdf(
                renderDocument(settings)
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `${fileName.replace(/\.pdf$/i, "")}.pdf`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF download failed:", error);
            toast.error("Failed to download PDF.");
        } finally {
            setDownloading(false);
        }
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => {
                if (!details.open) {
                    onClose();
                }
            }}
            size="cover"
            placement="center"
        >
            <Dialog.Backdrop />

            <Dialog.Positioner>
                <Dialog.Content
                    width="96vw"
                    maxWidth="1500px"
                    height="94vh"
                    maxHeight="94vh"
                    display="flex"
                    flexDirection="column"
                >
                    <Dialog.Header borderBottomWidth="1px">
                        <Box>
                            <Dialog.Title>
                                {title} — Preview
                            </Dialog.Title>

                            <Text fontSize="sm" color="gray.500">
                                Edit pharmacy details and see the live PDF preview.
                            </Text>
                        </Box>
                    </Dialog.Header>

                    <Dialog.Body
                        flex="1"
                        minHeight="0"
                        overflow="hidden"
                        padding={4}
                    >
                        <Flex
                            gap={5}
                            height="100%"
                            direction={{ base: "column", lg: "row" }}
                        >
                            <Box
                                width={{ base: "100%", lg: "320px" }}
                                flexShrink={0}
                                overflowY="auto"
                                paddingRight={2}
                            >
                                <PharmacyDetailsForm
                                    settings={settings}
                                    onChange={updateSetting}
                                />
                            </Box>

                            <Box
                                flex="1"
                                minWidth="0"
                                minHeight="300px"
                                borderWidth="1px"
                                borderColor="gray.200"
                                borderRadius="md"
                                overflow="hidden"
                                bg="gray.100"
                            >
                                <PDFViewer
                                    width="100%"
                                    height="100%"
                                    showToolbar
                                    style={{
                                        border: "none",
                                    }}
                                >
                                    {renderDocument(settings)}
                                </PDFViewer>
                            </Box>
                        </Flex>
                    </Dialog.Body>

                    <Dialog.Footer borderTopWidth="1px">
                        <Button
                            colorPalette="blue"
                            onClick={handleDownload}
                            loading={downloading}
                            disabled={downloading}
                            mr="auto"
                        >
                            Download PDF
                        </Button>

                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}
