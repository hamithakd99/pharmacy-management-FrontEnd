
import { Box, Button, Dialog, Flex, NativeSelect, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface PaymentDialogProps {
    order: any | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentDialog = ({ order, open, onClose, onSuccess }: PaymentDialogProps) => {
    const [paymentStatus, setPaymentStatus] = useState("PENDING");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (order) {
            setPaymentStatus(order.paymentStatus || "PENDING");
            setPaymentMethod(order.paymentMethod || "");
        }
    }, [order]);

    const handleSave = async () => {
        if (!order) return;

        if ((paymentStatus === "PAID" || paymentStatus === "PARTIAL") && !paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem("token");

            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/order/${order.id}/payment`,
                {
                    paymentStatus,
                    paymentMethod: paymentMethod || null,
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
            );

            toast.success("Payment updated successfully");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update payment");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(details) => !details.open && onClose()} size="md" placement="center">
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Edit Payment</Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                        <Text fontSize="sm" color="gray.500" mb={5}>
                            Order: {order?.orderNumber}
                        </Text>

                        <Flex direction="column" gap={4}>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={2}>Payment Status</Text>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="PARTIAL">Partial</option>
                                        <option value="PAID">Paid</option>
                                        <option value="REFUNDED">Refunded</option>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={2}>Payment Method</Text>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="">Select payment method</option>
                                        <option value="CASH">Cash</option>
                                        <option value="CARD">Card</option>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                        <option value="OTHER">Other</option>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Box>
                        </Flex>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button variant="outline" onClick={onClose} disabled={saving}>
                            Cancel
                        </Button>
                        <Button colorPalette="blue" onClick={handleSave} loading={saving}>
                            Save Changes
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default PaymentDialog;