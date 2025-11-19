import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import type { Order } from "../OrdersTable/OrdersTable";
import "./CustomerPanel.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function formatDateTime(iso: string) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return (
        d.toLocaleDateString("de-DE") +
        " " +
        d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    );
}

export default function CustomerPanel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            const numericId = parseInt(id!.replace(/^A/, ""), 10);

            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("id", numericId)
                .single();

            if (error) {
                setError(error.message);
            } else {
                setOrder(data);
                setNewStatus(data.status);
            }

            setLoading(false);
        };

        fetchOrder();
    }, [id]);

    const saveStatus = async () => {
        if (!id) return;

        setActionLoading(true);
        const numericId = parseInt(id.replace(/^A/, ""), 10);

        const { data, error } = await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", numericId)
            .select(); // 👈 return updated rows

        console.log("update result", { data, error });

        if (error) {
            alert("Fehler beim Speichern: " + error.message);
        } else if (data && data.length === 0) {
            alert("Update hat keine Zeilen getroffen (falsche ID?)");
        } else {
            setOrder(data[0]);
        }

        setActionLoading(false);
    };

    const deleteOrder = async () => {
        if (!id) return;
        if (!confirm("Willst du diese Bestellung löschen?")) return;

        setActionLoading(true);
        const numericId = parseInt(id.replace(/^A/, ""), 10);

        const { data, error } = await supabase
            .from("orders")
            .delete()
            .eq("id", numericId)
            .select();

        console.log("delete result", { data, error });

        if (error) {
            alert("Fehler beim Löschen: " + error.message);
            setActionLoading(false);
            return;
        }

        // if data is empty → keine Zeile getroffen
        if (!data || data.length === 0) {
            alert("Keine Bestellung mit dieser ID gefunden.");
            setActionLoading(false);
            return;
        }

        navigate("/dashboard");
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) return <div className="panel-wrapper error">{error}</div>;
    if (!order) return <div className="panel-wrapper">Nicht gefunden</div>;

    return (
        <div className="panel-wrapper">
            <div className="panel-card">
                <h1>Bestellung #{order.id}</h1>

                <div className="panel-item">
                    <label>Kunde</label>
                    <p>{order.customer_name}</p>
                </div>

                <div className="panel-item">
                    <label>Service</label>
                    <p>{order.service}</p>
                </div>

                <div className="panel-item">
                    <label>Erstellt am</label>
                    <p>{formatDateTime(order.created_at)}</p>
                </div>

                <div className="panel-item">
                    <label>Preis</label>
                    <p>€{order.price.toFixed(2)}</p>
                </div>

                <div className="panel-item">
                    <label>Status</label>
                    <select
                        className="panel-select"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        disabled={actionLoading}
                    >
                        <option>New</option>
                        <option>In progress</option>
                        <option>Scheduled</option>
                        <option>Done</option>
                        <option>Cancelled</option>
                    </select>
                </div>

                <button
                    className="btn-primary"
                    disabled={actionLoading}
                    onClick={saveStatus}
                >
                    {actionLoading ? "Speichern…" : "Status speichern"}
                </button>

                <button
                    className="btn-danger"
                    disabled={actionLoading}
                    onClick={deleteOrder}
                >
                    {actionLoading ? "Lösche…" : "Bestellung löschen"}
                </button>
            </div>
        </div>
    );
}
