import { Badge, Button, HStack, Table, Text } from "@chakra-ui/react";
import type { StaffUser } from "./user.types";


type Props = {
    users: StaffUser[];
    onView: (user: StaffUser) => void;
    onEdit: (user: StaffUser) => void;
    onDelete: (user: StaffUser) => void;
};

export default function StaffTable({
    users,
    onView,
    onEdit,
    onDelete,
}: Props) {

    return (
        <Table.ScrollArea
            borderWidth="1px"
            borderColor="gray.200"
            rounded="lg"
            overflowX="auto"
        >
            <Table.Root
                variant="outline"
                minW="950px"
            >
                <Table.Header>
                    <Table.Row bg="gray.50">

                        <Table.ColumnHeader>
                            User ID
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Name
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Email
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Contact
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Role
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            City
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Actions
                        </Table.ColumnHeader>

                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {users.map((user) => (
                        <Table.Row
                            key={user.id}
                            _hover={{
                                bg: "gray.50",
                            }}
                        >

                            <Table.Cell
                                fontWeight="600"
                            >
                                {user.userId}
                            </Table.Cell>

                            <Table.Cell>
                                <Text fontWeight="600">
                                    {user.firstName}{" "}
                                    {user.lastName}
                                </Text>
                            </Table.Cell>

                            <Table.Cell>
                                {user.email}
                            </Table.Cell>

                            <Table.Cell>
                                {user.contactNumber}
                            </Table.Cell>

                            <Table.Cell>
                                <Badge
                                    colorPalette={
                                        user.role ===
                                        "ADMIN"
                                            ? "purple"
                                            : user.role ===
                                              "CASHIER"
                                            ? "blue"
                                            : "green"
                                    }
                                >
                                    {user.role}
                                </Badge>
                            </Table.Cell>

                            <Table.Cell>
                                {user.city}
                            </Table.Cell>

                            <Table.Cell>
                                <HStack gap={2}>

                                    <Button
                                        size="sm"
                                        colorPalette="blue"
                                        onClick={() =>
                                            onView(user)
                                        }
                                    >
                                        View
                                    </Button>

                                    <Button
                                        size="sm"
                                        colorPalette="orange"
                                        onClick={() =>
                                            onEdit(user)
                                        }
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        size="sm"
                                        colorPalette="red"
                                        onClick={() =>
                                            onDelete(user)
                                        }
                                    >
                                        Delete
                                    </Button>

                                </HStack>
                            </Table.Cell>

                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
}