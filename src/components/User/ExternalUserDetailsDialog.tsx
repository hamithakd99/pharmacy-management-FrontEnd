import { Box, Button, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import type { ExternalUser } from "./user.types";

type Props = {
    open: boolean;
    user: ExternalUser | null;
    onClose: () => void;
};

export default function ExternalUserDetailsDialog({
    open,
    user,
    onClose
}: Props) {
    if (!open || !user) {
        return null;
    }

    return (
        <Box
            position="fixed"
            inset="0"
            zIndex={9999}
            bg="blackAlpha.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Box
                bg="white"
                width="100%"
                maxW="700px"
                maxH="90vh"
                overflowY="auto"
                rounded="xl"
                boxShadow="2xl"
            >
                <Box
                    px={6}
                    py={5}
                    borderBottomWidth="1px"
                    borderColor="gray.200"
                >
                    <Heading size="md">
                        {user.role === "SUPPLIER"
                            ? "Supplier Details"
                            : "Customer Details"}
                    </Heading>

                    <Text
                        fontSize="sm"
                        color="gray.500"
                        mt={1}
                    >
                        {user.userId}
                    </Text>
                </Box>

                <Box p={6}>
                    <Box mb={6}>
                        <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="gray.600"
                            mb={3}
                        >
                            Personal Information
                        </Text>

                        <SimpleGrid
                            columns={{
                                base: 1,
                                md: 2
                            }}
                            gap={4}
                        >
                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    First Name
                                </Text>
                                <Text fontWeight="600">
                                    {user.firstName}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Last Name
                                </Text>
                                <Text fontWeight="600">
                                    {user.lastName}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Nickname
                                </Text>
                                <Text>
                                    {user.nickName || "-"}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Type
                                </Text>
                                <Text
                                    fontWeight="600"
                                    color={
                                        user.role === "SUPPLIER"
                                            ? "orange.600"
                                            : "green.600"
                                    }
                                >
                                    {user.role}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Email
                                </Text>
                                <Text>
                                    {user.email}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Contact Number
                                </Text>
                                <Text>
                                    {user.contactNumber}
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </Box>

                    <Box>
                        <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="gray.600"
                            mb={3}
                        >
                            Address Information
                        </Text>

                        <SimpleGrid
                            columns={{
                                base: 1,
                                md: 2
                            }}
                            gap={4}
                        >
                            <Box
                                gridColumn={{
                                    md: "span 2"
                                }}
                            >
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Address Line 1
                                </Text>
                                <Text>
                                    {user.addressLine1}
                                </Text>
                            </Box>

                            <Box
                                gridColumn={{
                                    md: "span 2"
                                }}
                            >
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Address Line 2
                                </Text>
                                <Text>
                                    {user.addressLine2 || "-"}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    City
                                </Text>
                                <Text>
                                    {user.city}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Province
                                </Text>
                                <Text>
                                    {user.province.replace(
                                        "_",
                                        " "
                                    )}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Postal Code
                                </Text>
                                <Text>
                                    {user.postalCode || "-"}
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </Box>
                </Box>

                <Flex
                    justify="flex-end"
                    px={6}
                    py={4}
                    borderTopWidth="1px"
                    borderColor="gray.200"
                >
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
}