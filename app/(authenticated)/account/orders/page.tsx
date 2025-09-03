"use client";

import "@/styles/components/accountOrders.scss";

const orders = [
  {
    id: 1,
    time: "02/07/2025 14:30",
    code: "VEA123456",
    theater: "Galaxy Long Biên - Rạp 3 - Ghế B5, B6",
    total: "180.000đ",
    rp: 9,
  },
  {
    id: 2,
    time: "01/07/2025 18:45",
    code: "VEB234567",
    theater: "Galaxy Nguyễn Du - Rạp 5 - Ghế C1",
    total: "90.000đ",
    rp: 4,
  },
  {
    id: 3,
    time: "30/06/2025 20:00",
    code: "VEC345678",
    theater: "Galaxy Tân Bình - Rạp 1 - Ghế A7, A8",
    total: "190.000đ",
    rp: 10,
  },
  {
    id: 4,
    time: "29/06/2025 10:00",
    code: "VED456789",
    theater: "Galaxy Mipec Long Biên - Rạp 2 - Ghế D3",
    total: "80.000đ",
    rp: 3,
  },
  {
    id: 5,
    time: "28/06/2025 16:10",
    code: "VEE567890",
    theater: "Galaxy Quang Trung - Rạp 4 - Ghế F6, F7",
    total: "170.000đ",
    rp: 8,
  },
  {
    id: 6,
    time: "26/06/2025 13:00",
    code: "VEF678901",
    theater: "Galaxy Đà Nẵng - Rạp 6 - Ghế E2",
    total: "85.000đ",
    rp: 4,
  },
  {
    id: 7,
    time: "24/06/2025 19:00",
    code: "VEG789012",
    theater: "Galaxy Lý Chính Thắng - Rạp 3 - Ghế C4",
    total: "95.000đ",
    rp: 5,
  },
  {
    id: 8,
    time: "22/06/2025 15:30",
    code: "VEH890123",
    theater: "Galaxy Nha Trang - Rạp 1 - Ghế A1",
    total: "75.000đ",
    rp: 2,
  },
  {
    id: 9,
    time: "20/06/2025 17:00",
    code: "VEI901234",
    theater: "Galaxy Cần Thơ - Rạp 2 - Ghế D1",
    total: "90.000đ",
    rp: 4,
  },
  {
    id: 10,
    time: "18/06/2025 21:00",
    code: "VEJ012345",
    theater: "Galaxy Huế - Rạp 5 - Ghế G3",
    total: "85.000đ",
    rp: 4,
  },
];

export default function AccountOrdersPage() {
  return (
    <div className="orders-page">
      <h2 className="title">Lịch sử giao dịch</h2>

      <div className="filter-controls">
        <select>
          <option>Đặt vé</option>
          <option>Đặt bắp nước</option>
        </select>
        <input type="month" defaultValue="2025-07" />
      </div>

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
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.time}</td>
              <td>{order.code}</td>
              <td>{order.theater}</td>
              <td>{order.total}</td>
              <td>{order.rp}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className="total-label">Tổng cộng</td>
            <td>{orders.reduce((sum, o) => sum + parseInt(o.total.replace(/\D/g, "")), 0).toLocaleString("vi-VN")}đ</td>
            <td className="total-point">{orders.reduce((sum, o) => sum + o.rp, 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
