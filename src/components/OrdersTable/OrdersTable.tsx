import { useNavigate } from "react-router-dom";
import "./OrdersTable.css";

export type Order = {
    id: string;
    customer_name: string;
    service: string;
    created_at: string; // ISO date
    price: number; // €
    status: "New" | "In progress" | "scheduled" | "done" | "cancelled";
};

export default function OrdersTable({ rows }: { rows: Order[] }) {
    const navigate = useNavigate();

    return (
        <div className="orders">
            <table className="ordersTable" role="table">
                <thead>
                    <tr>
                        <th>Bestellung #</th>
                        <th>Kunden Name</th>
                        <th>Service</th>
                        <th>Erstellt am</th>
                        <th>Preis</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r) => (
                        <tr
                            key={r.id}
                            onClick={() => {
                                navigate(`/dashboard/${r.id}`);
                            }}
                        >
                            <td data-label="Bestellung #">{r.id}</td>
                            <td data-label="Kunden Name">{r.customer_name}</td>
                            <td data-label="Service">{r.service}</td>
                            <td data-label="Erstellt am">
                                {formatDateTime(r.created_at)}
                            </td>
                            <td data-label="Preis">€{r.price.toFixed(2)}</td>
                            <td data-label="Status">
                                <span className={`badge ${r.status}`}>
                                    {r.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function formatDateTime(iso: string) {
    const d = new Date(iso);

    return (
        d.toLocaleDateString("de-DE") +
        " " +
        d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    );
}
