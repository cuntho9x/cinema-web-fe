"use client";

import { useEffect, useState } from "react";
import "@/styles/components/seatSelection.scss";

const rows = ["A", "B", "C", "D", "E", "F", "G"];
const cols = 12;

const seatTypes: { [key: string]: string } = {
  standard: "#ccc",
  vip: "#ffde59",
  couple: "#00eaff",
  sold: "#e62c2c",
  selected: "#9ae82b",
};

const comboData = [
  { id: "combo1", name: "Combo 1 - Sweet 22oz", price: 76500, img: "/combo1.png" },
  { id: "combo2", name: "Combo 2 - Sweet 22oz", price: 103500, img: "/combo1.png" },
  { id: "combo3", name: "HN Combo Aquafina", price: 67500, img: "/combo1.png" },
];

const SEAT_PRICE = 101000;

export default function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [comboCounts, setComboCounts] = useState<{ [key: string]: number }>({});
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSeat = (id: string) => {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min} phút, ${sec < 10 ? "0" : ""}${sec} giây`;
  };

  const handleComboChange = (combo: string, change: number) => {
    setComboCounts((prev) => ({
      ...prev,
      [combo]: Math.max(0, (prev[combo] || 0) + change),
    }));
  };

  const totalSeat = selectedSeats.length * SEAT_PRICE;
  const totalCombo = Object.entries(comboCounts).reduce((sum, [id, count]) => {
    const combo = comboData.find((c) => c.id === id);
    return sum + (combo ? combo.price * count : 0);
  }, 0);
  const grandTotal = totalSeat + totalCombo;

  return (
    <div className="seat-wrapper">
      <div className="center-screen">
        {step === 1 && (
          <>
            <h3>🎟 Chọn ghế</h3>
            <div className="screen-label">Màn hình</div>
            <div className="legend">
              {Object.entries(seatTypes).map(([type, color]) => (
                <div key={type} className="legend-item">
                  <span className="seat" style={{ backgroundColor: color }} />
                  {type === "selected"
                    ? "Ghế đã chọn"
                    : type === "sold"
                    ? "Ghế đã bán"
                    : type === "vip"
                    ? "VIP"
                    : type === "couple"
                    ? "Couple"
                    : "Standard"}
                </div>
              ))}
            </div>
            <div className="seat-map">
              {rows.map((row) => (
                <div className="seat-row" key={row}>
                  {Array.from({ length: cols }).map((_, i) => {
                    const id = `${row}${i + 1}`;
                    const isSelected = selectedSeats.includes(id);
                    const isVip = row === "D" || row === "E";
                    const isCouple = row === "G";
                    const isSold = id === "C6" || id === "F8";
                    const style = isSold
                      ? seatTypes.sold
                      : isSelected
                      ? seatTypes.selected
                      : isCouple
                      ? seatTypes.couple
                      : isVip
                      ? seatTypes.vip
                      : seatTypes.standard;

                    return (
                      <div
                        key={id}
                        className="seat"
                        style={{ backgroundColor: style }}
                        onClick={() => !isSold && toggleSeat(id)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3>🍿 Chọn combo đồ ăn</h3>
            <div className="combo-list">
              {comboData.map((combo) => (
                <div key={combo.id} className="combo-item">
                  <img src={combo.img} alt={combo.name} />
                  <div className="combo-info">
                    <p>{combo.name}</p>
                    <p>{combo.price.toLocaleString()} VND</p>
                    <div className="combo-control">
                      <button onClick={() => handleComboChange(combo.id, -1)}>−</button>
                      <span>{comboCounts[combo.id] || 0}</span>
                      <button onClick={() => handleComboChange(combo.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3>💳 Thanh toán</h3>
            <div className="payment-methods">
              {["VNPAY", "MoMo", "ZaloPay", "ShopeePay"].map((method) => (
                <div key={method}>
                  <input type="radio" name="pay" id={method} />
                  <label htmlFor={method}>{method}</label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="right-info">
        <h4>BHD Star The Garden</h4>
        <p><strong>MARACUDA: NHÓC QUẬY RỪNG XANH</strong></p>
        <p>Suất chiếu: 17h15 - Screen 6 - 11/7/2025</p>

        {selectedSeats.length > 0 && (
          <div className="ticket-info">
            <p>{selectedSeats.length} x Adult - VIP - 2D - ES</p>
            <p>{selectedSeats.join(", ")}</p>
            <p>{totalSeat.toLocaleString()} VND</p>
          </div>
        )}

        {totalCombo > 0 && <hr className="divider" />}

        {Object.entries(comboCounts).map(([id, count]) => {
          const combo = comboData.find((c) => c.id === id);
          return combo && count > 0 ? (
            <div key={id} className="combo-summary">
              <p>{count} x {combo.name}</p>
              <p>{(count * combo.price).toLocaleString()} VND</p>
            </div>
          ) : null;
        })}

        <hr className="divider" />
        <p><strong>Tổng tiền (Đã bao gồm phụ thu):</strong> {grandTotal.toLocaleString()} VND</p>

        {step === 1 && (
          <button
            className="next-btn"
            onClick={() => setStep(2)}
            disabled={selectedSeats.length === 0}
          >
            CHỌN ĐỒ ĂN (2/4)
          </button>
        )}

        {step === 2 && (
          <button className="next-btn" onClick={() => setStep(3)}>
            THANH TOÁN (3/4)
          </button>
        )}

        {step === 3 && (
          <button className="next-btn confirm">
            THANH TOÁN (4/4)
          </button>
        )}

        <button
          className="back-btn"
          onClick={() => setStep((prev) => (Math.max(1, prev - 1) as 1 | 2 | 3))}
        >
          ← Trở lại
        </button>

        <p className="countdown">⏳ Còn lại {formatTime()}</p>
      </div>
    </div>
  );
}
