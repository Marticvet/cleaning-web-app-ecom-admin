import "./Dashboard.css";
import OrdersTable, { type Order } from "../OrdersTable/OrdersTable";

const demoRows: Order[] = [
    {
        id: "A1024",
        customer: "Anna Müller",
        service: "Deep clean",
        createdAt: "2025-06-01",
        total: 129,
        status: "new",
    },
    {
        id: "A1025",
        customer: "John Doe",
        service: "Window wash",
        createdAt: "2025-06-02",
        total: 89,
        status: "in_progress",
    },
    {
        id: "A1026",
        customer: "M. Rossi",
        service: "Office clean",
        createdAt: "2025-06-03",
        total: 349,
        status: "scheduled",
    },
    {
        id: "A1027",
        customer: "S. Kim",
        service: "Carpet clean",
        createdAt: "2025-06-04",
        total: 149,
        status: "done",
    },
    {
        id: "A1028",
        customer: "C. Novak",
        service: "Move-out clean",
        createdAt: "2025-06-05",
        total: 289,
        status: "cancelled",
    },
];

export default function Dashboard() {
    return (
        <div className="dashboardWrapperContainer">
            <OrdersTable rows={demoRows} />
        </div>
    );
}
