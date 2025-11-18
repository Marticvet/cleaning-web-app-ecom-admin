import "./Dashboard.css";
import OrdersTable, { type Order } from "../OrdersTable/OrdersTable";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Dashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                setError(error.message);
            } else {
                setOrders(data);
            }

            setLoading(false);
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Loading…</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="dashboardWrapperContainer">
            <OrdersTable rows={orders} />
        </div>
    );
}
