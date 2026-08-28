export type StaffRole =
    | "EMPLOYEE"
    | "ADMIN"
    | "CASHIER";

export type Province =
    | "WESTERN"
    | "CENTRAL"
    | "SOUTHERN"
    | "NORTHERN"
    | "EASTERN"
    | "NORTH_WESTERN"
    | "NORTH_CENTRAL"
    | "UVA"
    | "SABARAGAMUWA";

export type ExternalUserRole =
    | "CUSTOMER"
    | "SUPPLIER";

export interface StaffUser {
    id: number;
    createdAt: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: StaffRole;
    contactNumber: string;
    nickName?: string | null;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    province: Province;
    postalCode?: string | null;
}

export interface ExternalUser {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: ExternalUserRole;
    contactNumber: string;
    nickName?: string | null;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    province: Province;
    postalCode?: string | null;
}