import {Box, Button, Field, Flex, Heading, Input, NativeSelect, SimpleGrid, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";

import type { ExternalUser, ExternalUserRole, Province } from "./user.types";

type ExternalUserFormProps = {
    user?: ExternalUser | null;
    onSubmit?: (
        data: Record<string, unknown>
    ) => void;
    onCancel?: () => void;
    loading?: boolean;
};

const provinces: Province[] = [
    "WESTERN",
    "CENTRAL",
    "SOUTHERN",
    "NORTHERN",
    "EASTERN",
    "NORTH_WESTERN",
    "NORTH_CENTRAL",
    "UVA",
    "SABARAGAMUWA"
];

const roles: ExternalUserRole[] = [
    "CUSTOMER",
    "SUPPLIER"
];

export default function ExternalUserForm({
    user,
    onSubmit,
    onCancel,
    loading = false
}: ExternalUserFormProps) {
    const isEdit = Boolean(user);

    const [formData, setFormData] =
        useState({
            firstName:
                user?.firstName ?? "",
            lastName:
                user?.lastName ?? "",
            email:
                user?.email ?? "",
            role:
                user?.role ?? "CUSTOMER",
            contactNumber:
                user?.contactNumber ?? "",
            nickName:
                user?.nickName ?? "",
            addressLine1:
                user?.addressLine1 ?? "",
            addressLine2:
                user?.addressLine2 ?? "",
            city:
                user?.city ?? "",
            province:
                user?.province ?? "WESTERN",
            postalCode:
                user?.postalCode ?? ""
        });

    const handleChange = (
        field: string,
        value: string
    ) => {
        setFormData(
            (current) => ({
                ...current,
                [field]: value
            })
        );
    };

    const handleSubmit = (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!formData.firstName.trim()) {
            return;
        }

        if (!formData.lastName.trim()) {
            return;
        }

        if (!formData.email.trim()) {
            return;
        }

        if (!formData.contactNumber.trim()) {
            return;
        }

        if (!formData.addressLine1.trim()) {
            return;
        }

        if (!formData.city.trim()) {
            return;
        }

        const data: Record<string, unknown> = {
            firstName:
                formData.firstName.trim(),

            lastName:
                formData.lastName.trim(),

            email:
                formData.email.trim(),

            role:
                formData.role,

            contactNumber:
                formData.contactNumber.trim(),

            nickName:
                formData.nickName.trim(),

            addressLine1:
                formData.addressLine1.trim(),

            addressLine2:
                formData.addressLine2.trim(),

            city:
                formData.city.trim(),

            province:
                formData.province,

            postalCode:
                formData.postalCode.trim()
        };

        onSubmit?.(data);
    };

    return (
        <Box
            as="form"
            onSubmit={handleSubmit}
            bg="white"
            p={6}
        >
            {/* =========================================
                HEADER
            ========================================= */}

            <Box mb={6}>
                <Heading
                    size="md"
                    fontWeight="700"
                >
                    {isEdit
                        ? "Edit External User"
                        : "Register External User"}
                </Heading>

                <Text
                    fontSize="sm"
                    color="gray.500"
                    mt={1}
                >
                    {isEdit
                        ? "Update customer or supplier information"
                        : "Create a new customer or supplier profile"}
                </Text>
            </Box>

            {/* =========================================
                PERSONAL INFORMATION
            ========================================= */}

            <Box mb={6}>
                <Text
                    fontSize="sm"
                    fontWeight="700"
                    color="gray.700"
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
                    {/* FIRST NAME */}

                    <Field.Root required>
                        <Field.Label>
                            First Name
                        </Field.Label>

                        <Input
                            value={
                                formData.firstName
                            }
                            onChange={(e) =>
                                handleChange(
                                    "firstName",
                                    e.target.value
                                )
                            }
                            placeholder="Enter first name"
                        />
                    </Field.Root>

                    {/* LAST NAME */}

                    <Field.Root required>
                        <Field.Label>
                            Last Name
                        </Field.Label>

                        <Input
                            value={
                                formData.lastName
                            }
                            onChange={(e) =>
                                handleChange(
                                    "lastName",
                                    e.target.value
                                )
                            }
                            placeholder="Enter last name"
                        />
                    </Field.Root>

                    {/* NICKNAME */}

                    <Field.Root>
                        <Field.Label>
                            Nickname
                        </Field.Label>

                        <Input
                            value={
                                formData.nickName
                            }
                            onChange={(e) =>
                                handleChange(
                                    "nickName",
                                    e.target.value
                                )
                            }
                            placeholder="Optional"
                        />
                    </Field.Root>

                    {/* ROLE */}

                    <Field.Root required>
                        <Field.Label>
                            User Type
                        </Field.Label>

                        <NativeSelect.Root>
                            <NativeSelect.Field
                                value={
                                    formData.role
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "role",
                                        e.target.value
                                    )
                                }
                            >
                                {roles.map(
                                    (role) => (
                                        <option
                                            key={role}
                                            value={role}
                                        >
                                            {role ===
                                            "CUSTOMER"
                                                ? "Customer"
                                                : "Supplier"}
                                        </option>
                                    )
                                )}
                            </NativeSelect.Field>

                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>

                    {/* EMAIL */}

                    <Field.Root required>
                        <Field.Label>
                            Email
                        </Field.Label>

                        <Input
                            type="email"
                            value={
                                formData.email
                            }
                            onChange={(e) =>
                                handleChange(
                                    "email",
                                    e.target.value
                                )
                            }
                            placeholder="Enter email address"
                        />
                    </Field.Root>

                    {/* CONTACT */}

                    <Field.Root required>
                        <Field.Label>
                            Contact Number
                        </Field.Label>

                        <Input
                            value={
                                formData.contactNumber
                            }
                            onChange={(e) =>
                                handleChange(
                                    "contactNumber",
                                    e.target.value
                                )
                            }
                            placeholder="Enter contact number"
                        />
                    </Field.Root>
                </SimpleGrid>
            </Box>

            {/* =========================================
                ADDRESS
            ========================================= */}

            <Box mb={6}>
                <Text
                    fontSize="sm"
                    fontWeight="700"
                    color="gray.700"
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
                    {/* ADDRESS LINE 1 */}

                    <Field.Root
                        required
                        gridColumn={{
                            md: "span 2"
                        }}
                    >
                        <Field.Label>
                            Address Line 1
                        </Field.Label>

                        <Input
                            value={
                                formData.addressLine1
                            }
                            onChange={(e) =>
                                handleChange(
                                    "addressLine1",
                                    e.target.value
                                )
                            }
                            placeholder="House / Street"
                        />
                    </Field.Root>

                    {/* ADDRESS LINE 2 */}

                    <Field.Root
                        gridColumn={{
                            md: "span 2"
                        }}
                    >
                        <Field.Label>
                            Address Line 2
                        </Field.Label>

                        <Textarea
                            value={
                                formData.addressLine2
                            }
                            onChange={(e) =>
                                handleChange(
                                    "addressLine2",
                                    e.target.value
                                )
                            }
                            placeholder="Apartment / additional address"
                            rows={2}
                        />
                    </Field.Root>

                    {/* CITY */}

                    <Field.Root required>
                        <Field.Label>
                            City
                        </Field.Label>

                        <Input
                            value={
                                formData.city
                            }
                            onChange={(e) =>
                                handleChange(
                                    "city",
                                    e.target.value
                                )
                            }
                            placeholder="Enter city"
                        />
                    </Field.Root>

                    {/* PROVINCE */}

                    <Field.Root required>
                        <Field.Label>
                            Province
                        </Field.Label>

                        <NativeSelect.Root>
                            <NativeSelect.Field
                                value={
                                    formData.province
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "province",
                                        e.target.value
                                    )
                                }
                            >
                                {provinces.map(
                                    (province) => (
                                        <option
                                            key={province}
                                            value={province}
                                        >
                                            {province.replace(
                                                "_",
                                                " "
                                            )}
                                        </option>
                                    )
                                )}
                            </NativeSelect.Field>

                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>

                    {/* POSTAL CODE */}

                    <Field.Root>
                        <Field.Label>
                            Postal Code
                        </Field.Label>

                        <Input
                            value={
                                formData.postalCode
                            }
                            onChange={(e) =>
                                handleChange(
                                    "postalCode",
                                    e.target.value
                                )
                            }
                            placeholder="Optional"
                        />
                    </Field.Root>
                </SimpleGrid>
            </Box>

            {/* =========================================
                ACTIONS
            ========================================= */}

            <Flex
                justify="flex-end"
                gap={3}
                pt={4}
                borderTopWidth="1px"
                borderColor="gray.200"
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    colorPalette="teal"
                    loading={loading}
                >
                    {isEdit
                        ? "Update User"
                        : "Create User"}
                </Button>
            </Flex>
        </Box>
    );
}