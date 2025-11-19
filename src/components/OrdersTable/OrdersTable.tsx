import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./OrdersTable.css";

export type Order = {
    id: string; // e.g. "A1024" or "1024" – see comment below
    customer_name: string;
    service: string;
    created_at: string; // ISO date from Supabase
    price: number;
    status: string;
};

export default function OrdersTable({ rows }: { rows: Order[] }) {
    const navigate = useNavigate();

    const [selected, setSelected] = useState<string[]>([]);
    const [sortField, setSortField] = useState<keyof Order>("created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [deleting, setDeleting] = useState(false);

    // -------------------
    // SELECTION
    // -------------------
    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selected.length === rows.length) {
            setSelected([]);
        } else {
            setSelected(rows.map((r) => r.id));
        }
    };

    // -------------------
    // SORTING
    // -------------------
    const changeSort = (field: keyof Order) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedRows = [...rows].sort((a, b) => {
        if (sortField === "created_at") {
            const tA = new Date(a.created_at).getTime();
            const tB = new Date(b.created_at).getTime();
            return sortDirection === "asc" ? tA - tB : tB - tA;
        }

        if (sortField === "price") {
            return sortDirection === "asc"
                ? a.price - b.price
                : b.price - a.price;
        }

        const valA = String(a[sortField] ?? "");
        const valB = String(b[sortField] ?? "");

        return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
    });

    // -------------------
    // BULK DELETE
    // -------------------
    const deleteSelected = async () => {
        if (selected.length === 0) return;
        if (!confirm(`Willst du ${selected.length} Bestellungen löschen?`))
            return;

        setDeleting(true);

        const { error } = await supabase
            .from("orders")
            .delete()
            .in("id", selected);

        setDeleting(false);

        if (error) {
            alert("Fehler beim Löschen: " + error.message);
            return;
        }

        // Easiest: reload list (or you can filter rows in parent instead)
        window.location.reload();
    };

    return (
        <div className="orders">
            {/* <div className="orders-actions">
                <button
                    className="btn-danger"
                    disabled={selected.length === 0 || deleting}
                    onClick={deleteSelected}
                >
                    {selected.length === 0
                        ? "Keine Auswahl"
                        : deleting
                        ? "Lösche…"
                        : `Lösche ${selected.length} ausgewählte`}
                </button>
            </div> */}

            <table className="ordersTable" role="table">
                <thead>
                    <tr>
                        <th className="select-col">
                            <div className="select-header">
                                <input
                                    type="checkbox"
                                    checked={selected.length === rows.length}
                                    onChange={toggleSelectAll}
                                />
                                {/* <span>Alle auswählen</span> */}

                                {selected.length > 0 && (
                                    <button
                                        className="delete-small"
                                        onClick={deleteSelected}
                                        disabled={deleting}
                                    >
                                        {selected.length === 1 &&
                                            "Löschen Bestellung"}
                                        {selected.length > 1 &&
                                            "Löschen Bestellungen"}
                                    </button>
                                )}
                            </div>
                        </th>

                        <th onClick={() => changeSort("id")}>Bestellung #</th>
                        <th onClick={() => changeSort("customer_name")}>
                            Kunden Name
                        </th>
                        <th onClick={() => changeSort("service")}>Service</th>
                        <th onClick={() => changeSort("created_at")}>
                            Erstellt am
                        </th>
                        <th onClick={() => changeSort("price")}>Preis</th>
                        <th onClick={() => changeSort("status")}>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {sortedRows.map((r) => (
                        <tr
                            key={r.id}
                            onClick={(e) => {
                                // prevent row click when clicking checkbox
                                if (
                                    (e.target as HTMLElement).tagName ===
                                    "INPUT"
                                )
                                    return;
                                navigate(`/dashboard/${r.id}`);
                            }}
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(r.id)}
                                    onChange={() => toggleSelect(r.id)}
                                />
                            </td>
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
    if (isNaN(d.getTime())) return "";
    return (
        d.toLocaleDateString("de-DE") +
        " " +
        d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    );
}
