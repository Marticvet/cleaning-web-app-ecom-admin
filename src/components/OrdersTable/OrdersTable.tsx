import "./OrdersTable.css";

export type Order = {
    id: string;
    customer: string;
    service: string;
    createdAt: string; // ISO date
    total: number; // €
    status: "new" | "in_progress" | "scheduled" | "done" | "cancelled";
};

export default function OrdersTable({ rows }: { rows: Order[] }) {
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
                        <tr key={r.id}>
                            <td data-label="Bestellung #">{r.id}</td>
                            <td data-label="Kunden Name">{r.customer}</td>
                            <td data-label="Service">{r.service}</td>
                            <td data-label="Erstellt am">
                                {new Date(r.createdAt).toLocaleDateString()}
                            </td>
                            <td data-label="Preis">€{r.total.toFixed(2)}</td>
                            <td data-label="Status">
                                <span className={`badge ${r.status}`}>
                                    {pretty(r.status)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function pretty(s: Order["status"]) {
    return (
        {
            new: "New",
            in_progress: "In progress",
            scheduled: "Scheduled",
            done: "Completed",
            cancelled: "Cancelled",
        } as const
    )[s];
}
