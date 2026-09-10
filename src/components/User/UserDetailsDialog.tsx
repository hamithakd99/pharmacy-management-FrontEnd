import {
    Badge,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Text,
} from "@chakra-ui/react";

interface StaffUser {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    contactNumber: string;
    nickName?: string | null;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    province: string;
    postalCode?: string | null;
    createdAt?: string;
}

interface UserDetailsDialogProps {
    open: boolean;
    user: StaffUser | null;
    onClose: () => void;
}

const UserDetailsDialog = ({
    open,
    user,
    onClose,
}: UserDetailsDialogProps) => {

    if (!open || !user) {
        return null;
    }

    const fullName =
        `${user.firstName} ${user.lastName}`;

    const fullAddress = [
        user.addressLine1,
        user.addressLine2,
        user.city,
        user.province,
        user.postalCode,
    ]
        .filter(Boolean)
        .join(", ");

    const formattedDate =
        user.createdAt
            ? new Date(
                user.createdAt
            ).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            )
            : "-";

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

            {/* MODAL */}

            <Box
                bg="white"
                width="100%"
                maxW="650px"
                maxH="90vh"
                overflowY="auto"
                rounded="xl"
                boxShadow="2xl"
            >

                {/* HEADER */}

                <Box
                    px={6}
                    py={5}
                    borderBottomWidth="1px"
                >
                    <Flex
                        justify="space-between"
                        align="center"
                    >

                        <Box>

                            <Text
                                fontSize="xl"
                                fontWeight="700"
                            >
                                Staff Details
                            </Text>

                            <Text
                                fontSize="sm"
                                color="gray.500"
                                mt={1}
                            >
                                Complete staff information
                            </Text>

                        </Box>

                        <Badge
                            colorPalette={
                                user.role === "ADMIN"
                                    ? "purple"
                                    : user.role === "CASHIER"
                                    ? "blue"
                                    : "green"
                            }
                            px={3}
                            py={1}
                            rounded="full"
                        >
                            {user.role}
                        </Badge>

                    </Flex>
                </Box>


                {/* BODY */}

                <Box px={6} py={6}>

                    {/* USER HEADER */}

                    <Flex
                        align="center"
                        gap={4}
                        mb={6}
                        p={4}
                        bg="gray.50"
                        rounded="lg"
                    >

                        <Flex
                            w="52px"
                            h="52px"
                            rounded="full"
                            bg="teal.600"
                            color="white"
                            align="center"
                            justify="center"
                            fontWeight="700"
                            fontSize="lg"
                            flexShrink={0}
                        >
                            {user.firstName
                                .charAt(0)
                                .toUpperCase()}

                            {user.lastName
                                .charAt(0)
                                .toUpperCase()}
                        </Flex>

                        <Box>

                            <Text
                                fontWeight="700"
                                fontSize="lg"
                            >
                                {fullName}
                            </Text>

                            <Text
                                fontSize="sm"
                                color="gray.500"
                            >
                                {user.userId}
                            </Text>

                        </Box>

                    </Flex>


                    {/* DETAILS */}

                    <Grid
                        templateColumns={{
                            base: "1fr",
                            md: "1fr 1fr",
                        }}
                        gap={5}
                    >

                        <GridItem>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                mb={1}
                            >
                                First Name
                            </Text>

                            <Text fontWeight="500">
                                {user.firstName}
                            </Text>
                        </GridItem>


                        <GridItem>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                mb={1}
                            >
                                Last Name
                            </Text>

                            <Text fontWeight="500">
                                {user.lastName}
                            </Text>
                        </GridItem>


                        <GridItem>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                mb={1}
                            >
                                Email
                            </Text>

                            <Text fontWeight="500">
                                {user.email}
                            </Text>
                        </GridItem>


                        <GridItem>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                mb={1}
                            >
                                Contact Number
                            </Text>

                            <Text fontWeight="500">
                                {user.contactNumber}
                            </Text>
                        </GridItem>


                        <GridItem>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                mb={1}
                            >
                                Nickname
                            </Text>

                            <Text fontWeight="500">
                                {user.nickName || "-"}
                            </Text>
                        </GridItem>


                        <GridItem>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                mb={1}
                            >
                                Role
                            </Text>

                            <Text fontWeight="500">
                                {user.role}
                            </Text>
                        </GridItem>


                        <GridItem
                            colSpan={{
                                base: 1,
                                md: 2,
                            }}
                        >

                            <Text
                                fontSize="xs"
                                color="gray.500"
                                mb={1}
                            >
                                Address
                            </Text>

                            <Text fontWeight="500">
                                {fullAddress || "-"}
                            </Text>

                        </GridItem>


                        <GridItem>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                mb={1}
                            >
                                Province
                            </Text>

                            <Text fontWeight="500">
                                {user.province}
                            </Text>
                        </GridItem>


                        <GridItem>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                mb={1}
                            >
                                Registered Date
                            </Text>

                            <Text fontWeight="500">
                                {formattedDate}
                            </Text>
                        </GridItem>

                    </Grid>

                </Box>


                {/* FOOTER */}

                <Flex
                    justify="flex-end"
                    px={6}
                    py={4}
                    borderTopWidth="1px"
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
};

export default UserDetailsDialog;