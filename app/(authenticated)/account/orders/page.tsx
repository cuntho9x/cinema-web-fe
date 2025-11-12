"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/components/accountOrders.scss";
import TicketModal from "@/components/TicketModal";

axios.defaults.withCredentials = true;

interface Order {
  order_id: number;
  order_date: string;
  total_price: number;
  discount: number;
  status: string;
  payment_method?: string;
  scheduleShowtime: {
    theater: {
      theater_name: string;
    };
    room: {
      room_name: string;
    };
    movie: {
      movie_title: string;
    };
    start_time: string;
  };
  tickets: Array<{
    ticket_code: string;
    seat: {
      seat_code: string;
    };
  }>;
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/order/my-orders', {
          withCredentials: true,
        });
        setOrders(response.data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
          setError('Vui lòng đăng nhập để xem đơn hàng');
        } else {
          setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
        }
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // Format date: "2025-07-02T14:30:00.000Z" -> "02/07/2025 14:30"
  function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Format order info: "Rạp - Phòng - Ghế A1, A2"
  function formatOrderInfo(order: Order): string {
    const theater = order.scheduleShowtime?.theater?.theater_name || '';
    const room = order.scheduleShowtime?.room?.room_name || '';
    const seats = order.tickets?.map(t => t.seat?.seat_code).filter(Boolean).join(', ') || '';
    return `${theater} - ${room}${seats ? ` - Ghế ${seats}` : ''}`;
  }

  // Get first ticket code as order code
  function getOrderCode(order: Order): string {
    return order.tickets?.[0]?.ticket_code || `ORDER-${order.order_id}`;
  }

  // Calculate RP points (example: 1 point per 10,000 VND)
  function calculateRP(totalPrice: number): number {
    return Math.floor(totalPrice / 10000);
  }

  if (loading) {
    return (
      <div className="orders-page">
        <h2 className="title">Lịch sử giao dịch</h2>
        <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <h2 className="title">Lịch sử giao dịch</h2>
        <div style={{ padding: '40px', textAlign: 'center', color: '#e62c2c' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2 className="title">Lịch sử giao dịch</h2>

      {/* <div className="filter-controls">
        <select>
          <option>Đặt vé</option>
          <option>Đặt bắp nước</option>
        </select>
        <input type="month" defaultValue="2025-07" />
      </div> */}

      {orders.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Thời gian giao dịch</th>
              <th>Mã lấy vé</th>
              <th>Thông tin rạp</th>
              <th>Tổng tiền</th>
              <th>Điểm RP</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.order_id}>
                <td>{index + 1}</td>
                <td>{formatDateTime(order.order_date)}</td>
                <td>
                  <button
                    className="ticket-code-link"
                    onClick={() => setSelectedOrderId(order.order_id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#007bff",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "inherit",
                    }}
                  >
                    {getOrderCode(order)}
                  </button>
                </td>
                <td>{formatOrderInfo(order)}</td>
                <td>{order.total_price.toLocaleString('vi-VN')}đ</td>
                <td>{calculateRP(order.total_price)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="total-label">Tổng cộng</td>
              <td>
                {orders.reduce((sum, o) => sum + o.total_price, 0).toLocaleString('vi-VN')}đ
              </td>
              <td className="total-point">
                {orders.reduce((sum, o) => sum + calculateRP(o.total_price), 0)}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Ticket Modal */}
      <TicketModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
