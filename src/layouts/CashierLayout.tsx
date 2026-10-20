
import RoleLayout, { type MenuItem } from "./RoleLayout";

const cashierMenu: MenuItem[] = [
    {
        label: "Dashboard",
        path: "/cashier/dashboard",
    },
    {
        label: "Products",
        path: "/cashier/products",
    },
    {
        label: "Point of Sale",
        path: "/cashier/orders",
    },
];

export default function CashierLayout() {
    return (
        <RoleLayout
            title="Cashier"
            menuItems={cashierMenu}
        />
    );
}
