
import RoleLayout, { type MenuItem } from "./RoleLayout";

const employeeMenu: MenuItem[] = [
  { label: "Dashboard", path: "/employee/dashboard" },
//   { label: "Products", path: "/employee/products" },
//   { label: "Stock", path: "/employee/stock" },
//   { label: "Goods Received", path: "/employee/grn" },
];

export default function EmployeeLayout() {
  return (
    <RoleLayout
      title="Employee"
      menuItems={employeeMenu}
    />
  );
}
