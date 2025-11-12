"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/components/seatSelection.scss";

axios.defaults.withCredentials = true;

interface Seat {
  seat_id: number;
  seat_code: string;
  row_label: string;
  column_number: number;
  seat_type: "STANDARD" | "VIP" | "COUPLE";
  status: "AVAILABLE" | "SELECTED" | "SOLD" | "UNAVAILABLE";
}

interface SeatPrice {
  price_id: number;
  seat_type: "STANDARD" | "VIP" | "COUPLE";
  base_price: number;
}

interface ScheduleShowtime {
  id: number;
  movie_id: number;
  theater_id: number;
  room_id: number;
  show_date: string;
  start_time: string;
  end_time: string;
  theater: { theater_name: string };
  room: { room_name: string };
  movie: { movie_title: string };
}

// Interface cho Food từ API
interface Food {
  food_id: number;
  food_name: string;
  food_description: string | null;
  food_price: number;
  food_img: string | null;
}

const seatTypeColors: { [key: string]: string } = {
  STANDARD: "rgb(74 253 175)", // Green
  VIP: "#ffde59", // Yellow
  COUPLE: "rgb(230 50 50)", // purple
  SOLD: "#cccccc", // Light grey
  SELECTED: "#9ae82b", // Light green
};

interface SeatSelectionProps {
  scheduleShowtimeId: number;
}

export default function SeatSelection({ scheduleShowtimeId }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [comboCounts, setComboCounts] = useState<{ [key: string]: number }>({});
  const [timer, setTimer] = useState(300);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatPrices, setSeatPrices] = useState<SeatPrice[]>([]);
  const [showtime, setShowtime] = useState<ScheduleShowtime | null>(null);
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [showSeatsDropdown, setShowSeatsDropdown] = useState(false);
  const [showFoodsDropdown, setShowFoodsDropdown] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!scheduleShowtimeId) {
        console.warn("No scheduleShowtimeId provided");
        setSeats([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`[SeatSelection] Fetching data for showtime ID: ${scheduleShowtimeId}`);

        // Fetch showtime info
        const showtimeRes = await fetch(`http://localhost:3000/schedule-showtime/${scheduleShowtimeId}`);
        if (showtimeRes.ok) {
          const showtimeData = await showtimeRes.json();
          console.log("[SeatSelection] Showtime data:", showtimeData);
          setShowtime(showtimeData);
          
          if (showtimeData.room_id) {
            console.log(`[SeatSelection] Showtime has room_id: ${showtimeData.room_id}`);
          }
        } else {
          const errorText = await showtimeRes.text();
          console.error(`[SeatSelection] Failed to fetch showtime: ${showtimeRes.status}`, errorText);
        }

        // Fetch seats
        const seatsUrl = `http://localhost:3000/schedule-showtime/seats/${scheduleShowtimeId}`;
        console.log(`[SeatSelection] Fetching seats from: ${seatsUrl}`);
        
        const seatsRes = await fetch(seatsUrl);
        console.log(`[SeatSelection] Seats response status: ${seatsRes.status}`);
        
        if (seatsRes.ok) {
          const seatsData = await seatsRes.json();
          console.log("[SeatSelection] Raw seats data:", seatsData);
          console.log("[SeatSelection] Is array?", Array.isArray(seatsData));
          console.log("[SeatSelection] Number of seats:", Array.isArray(seatsData) ? seatsData.length : 0);
          
          if (Array.isArray(seatsData)) {
            if (seatsData.length > 0) {
              console.log("[SeatSelection] First seat example:", seatsData[0]);
            }
            setSeats(seatsData);
          } else {
            console.error("[SeatSelection] Seats data is not an array:", typeof seatsData, seatsData);
            setSeats([]);
          }
        } else {
          const errorText = await seatsRes.text();
          console.error(`[SeatSelection] Failed to fetch seats: ${seatsRes.status} ${seatsRes.statusText}`, errorText);
          setSeats([]);
        }

        // Fetch seat prices
        const pricesRes = await fetch(`http://localhost:3000/schedule-showtime/seat-prices/all`);
        if (pricesRes.ok) {
          const pricesData = await pricesRes.json();
          console.log("[SeatSelection] Seat prices:", pricesData);
          if (Array.isArray(pricesData)) {
            setSeatPrices(pricesData);
          }
        } else {
          console.error(`[SeatSelection] Failed to fetch seat prices: ${pricesRes.status}`);
        }
      } catch (error) {
        console.error("[SeatSelection] Error fetching seat data:", error);
        setSeats([]);
      } finally {
        setLoading(false);
        console.log("[SeatSelection] Finished loading");
      }
    }

    fetchData();
  }, [scheduleShowtimeId]);

  const toggleSeat = (seatCode: string, status: string) => {
    if (status === "SOLD" || status === "UNAVAILABLE") return;
    setSelectedSeats((prev) =>
      prev.includes(seatCode) ? prev.filter((s) => s !== seatCode) : [...prev, seatCode]
    );
  };

  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min} phút, ${sec < 10 ? "0" : ""}${sec} giây`;
  };

  const handleComboChange = (foodId: number, change: number) => {
    setComboCounts((prev) => ({
      ...prev,
      [foodId]: Math.max(0, (prev[foodId] || 0) + change),
    }));
  };

  // Fetch foods khi chuyển sang step 2
  useEffect(() => {
    async function fetchFoods() {
      if (step === 2 && foods.length === 0) {
        try {
          setLoadingFoods(true);
          const res = await fetch('http://localhost:3000/food');
          if (res.ok) {
            const foodsData = await res.json();
            console.log("[SeatSelection] Fetched foods:", foodsData);
            setFoods(foodsData);
          } else {
            console.error("[SeatSelection] Failed to fetch foods:", res.status);
          }
        } catch (error) {
          console.error("[SeatSelection] Error fetching foods:", error);
        } finally {
          setLoadingFoods(false);
        }
      }
    }

    fetchFoods();
  }, [step, foods.length]);

  // Group seats by row using useMemo to recalculate when seats change
  const { seatsByRow, sortedRows, maxColumns } = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    
    seats.forEach((seat) => {
      if (!grouped[seat.row_label]) {
        grouped[seat.row_label] = [];
      }
      grouped[seat.row_label].push(seat);
    });

    // Sort rows
    const sorted = Object.keys(grouped).sort();
    
    // Sort seats within each row by column_number
    sorted.forEach((row) => {
      grouped[row].sort((a, b) => a.column_number - b.column_number);
    });

    // Tìm số cột tối đa
    const maxCols = Math.max(...sorted.map(row => Math.max(...grouped[row].map(s => s.column_number))), 0);

    return { seatsByRow: grouped, sortedRows: sorted, maxColumns: maxCols };
  }, [seats]);

  // Tính toán scale động dựa trên số rows và columns
  const calculateScale = useMemo(() => {
    if (sortedRows.length === 0) return 0.7;
    
    // Chiều cao khả dụng cho seat map (trừ header, legend, etc.)
    const availableHeight = 500; // Có thể điều chỉnh
    const availableWidth = 800; // Có thể điều chỉnh
    
    // Chiều cao cần thiết: số rows * (chiều cao ghế + gap)
    const seatHeight = 24; // height của seat
    const rowGap = 2; // gap giữa các rows
    const headerHeight = 150; // Chiều cao của header, legend, etc.
    const neededHeight = sortedRows.length * (seatHeight + rowGap) + headerHeight;
    
    // Chiều rộng cần thiết: số columns * (chiều rộng ghế + gap) + row label
    const seatWidth = 22; // width của seat
    const seatGap = 2; // gap giữa các seats
    const rowLabelWidth = 20; // width của row label
    const neededWidth = maxColumns * (seatWidth + seatGap) + rowLabelWidth;
    
    // Tính scale dựa trên cả height và width
    const scaleByHeight = availableHeight / neededHeight;
    const scaleByWidth = availableWidth / neededWidth;
    
    // Lấy scale nhỏ hơn để đảm bảo fit cả hai chiều
    const calculatedScale = Math.min(scaleByHeight, scaleByWidth, 0.9);
    
    // Giới hạn scale trong khoảng hợp lý
    return Math.max(0.5, Math.min(0.9, calculatedScale));
  }, [sortedRows.length, maxColumns]);

  // Debug log
  useEffect(() => {
    if (!loading && seats.length > 0) {
      console.log("Seats data:", seats);
      console.log("Seats count:", seats.length);
      console.log("Seats by row:", seatsByRow);
      console.log("Sorted rows:", sortedRows);
      console.log("Seat prices:", seatPrices);
    } else if (!loading && seats.length === 0) {
      console.log("No seats found. scheduleShowtimeId:", scheduleShowtimeId);
      console.log("Showtime data:", showtime);
    }
  }, [loading, seats.length, scheduleShowtimeId, seatsByRow, sortedRows, seatPrices, showtime]);

  // Get price for a seat type
  const getSeatPrice = (seatType: string): number => {
    const price = seatPrices.find((p) => p.seat_type === seatType);
    return price?.base_price || 0;
  };

  // Calculate total seat price
  const totalSeat = selectedSeats.reduce((sum, seatCode) => {
    const seat = seats.find((s) => s.seat_code === seatCode);
    if (seat) {
      return sum + getSeatPrice(seat.seat_type);
    }
    return sum;
  }, 0);

  const totalCombo = Object.entries(comboCounts).reduce((sum, [foodId, count]) => {
    const food = foods.find((f) => f.food_id === Number(foodId));
    return sum + (food ? Number(food.food_price) * count : 0);
  }, 0);
  const grandTotal = totalSeat + totalCombo;

  // Hàm xử lý thanh toán
  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế');
      return;
    }

    if (!selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Kiểm tra authentication trước khi thanh toán
      const userRes = await axios.get('http://localhost:3000/auth/me', {
        withCredentials: true,
      });

      if (!userRes.data) {
        alert('Vui lòng đăng nhập để thanh toán');
        router.push('/login');
        return;
      }

      // Chuẩn bị dữ liệu để tạo order
      const seatDtos = selectedSeats.map((seatCode) => {
        const seat = seats.find((s) => s.seat_code === seatCode);
        const price = getSeatPrice(seat?.seat_type || '');
        return {
          seat_code: seatCode,
          price: price,
        };
      });

      const orderData = {
        schedule_showtime_id: scheduleShowtimeId,
        seats: seatDtos,
        total_price: grandTotal,
        discount: 0,
        payment_method: selectedPaymentMethod,
      };

      // Gọi API tạo order
      const response = await axios.post('http://localhost:3000/order', orderData, {
        withCredentials: true,
      });

      if (response.data) {
        alert('Đặt vé thành công! Mã đơn hàng: ' + response.data.order.order_id);
        // Có thể redirect đến trang chi tiết đơn hàng hoặc trang danh sách đơn hàng
        router.push('/account/orders');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      if (error.response?.status === 401) {
        alert('Vui lòng đăng nhập để thanh toán');
        router.push('/login');
      } else if (error.response?.data?.message) {
        alert('Lỗi: ' + error.response.data.message);
      } else {
        alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Parse datetime string and extract time without timezone conversion
  function parseTimeFromDateTime(dateTimeStr: string): string {
    const match = dateTimeStr.match(/(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, , , , hour, minute] = match;
      return `${hour}:${minute}`;
    }
    const date = new Date(dateTimeStr);
    if (!isNaN(date.getTime())) {
      const isoMatch = dateTimeStr.match(/T(\d{2}):(\d{2}):(\d{2})/);
      if (isoMatch) {
        const [, hour, minute] = isoMatch;
        return `${hour}:${minute}`;
      }
      const hour = String(date.getUTCHours()).padStart(2, "0");
      const minute = String(date.getUTCMinutes()).padStart(2, "0");
      return `${hour}:${minute}`;
    }
    return "00:00";
  }

  // Format date and time
  const formatDateTime = (dateTimeStr: string) => {
    // Parse date
    const match = dateTimeStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    let dateStr = "";
    if (match) {
      const [, year, month, day] = match;
      dateStr = `${day}/${month}/${year}`;
    } else {
      const date = new Date(dateTimeStr);
      if (!isNaN(date.getTime())) {
        dateStr = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
      }
    }
    
    const time = parseTimeFromDateTime(dateTimeStr);
    return { time, date: dateStr };
  };

  if (loading) {
    return <div className="seat-wrapper">Đang tải...</div>;
  }

  if (!seats || seats.length === 0) {
    return (
      <div className="seat-wrapper">
        <div className="center-screen">
          <h3>🎟 Chọn ghế</h3>
          <p>Không tìm thấy ghế cho suất chiếu này. Vui lòng thử lại sau.</p>
          <p>Debug: scheduleShowtimeId = {scheduleShowtimeId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-wrapper">
      <div className="center-screen">
        {step === 1 && (
          <>
            <h3>🎟 Chọn ghế</h3>
            
            {/* Seat type and price legend */}
            <div className="seat-legend-with-price">
              {seatPrices.map((price) => {
                const typeName = 
                  price.seat_type === "STANDARD" ? "Thường" :
                  price.seat_type === "VIP" ? "VIP" :
                  "Ghế đôi";
                return (
                  <div key={price.seat_type} className="legend-price-item">
                    <span 
                      className="legend-seat" 
                      style={{ backgroundColor: seatTypeColors[price.seat_type] }}
                    />
                    <span className="legend-text">{typeName}</span>
                    <span className="legend-price">{price.base_price.toLocaleString()} VND</span>
                  </div>
                );
              })}
            </div>

            <div className="screen-label">Màn hình</div>
            
            <div className="legend">
              <div className="legend-item">
                <span className="seat" style={{ backgroundColor: seatTypeColors.SELECTED }} />
                Ghế đã chọn
              </div>
              <div className="legend-item">
                <span className="seat" style={{ backgroundColor: seatTypeColors.SOLD }} />
                Ghế đã bán
              </div>
            </div>

            <div 
              className="seat-map" 
              data-rows={sortedRows.length}
              data-cols={maxColumns}
              style={{
                transform: `scale(${calculateScale})`,
                transformOrigin: 'top center'
              }}
            >
              {sortedRows.length > 0 ? (
                sortedRows.map((rowLabel) => {
                  const rowSeats = seatsByRow[rowLabel];
                  if (!rowSeats || rowSeats.length === 0) {
                    console.warn(`Row ${rowLabel} has no seats`);
                    return null;
                  }
                  
                  const maxColumn = Math.max(...rowSeats.map((s) => s.column_number));
                  const seatsArray: (Seat | null)[] = new Array(maxColumn).fill(null);
                  
                  rowSeats.forEach((seat) => {
                    if (seat.column_number > 0 && seat.column_number <= maxColumn) {
                      seatsArray[seat.column_number - 1] = seat;
                    }
                  });

                  return (
                    <div className="seat-row" key={rowLabel}>
                      <span className="row-label">{rowLabel}</span>
                      {seatsArray.map((seat, index) => {
                        if (!seat) {
                          return <div key={`empty-${rowLabel}-${index}`} className="seat empty-seat" />;
                        }
                        const isSelected = selectedSeats.includes(seat.seat_code);
                        const isSold = seat.status === "SOLD" || seat.status === "UNAVAILABLE";
                        const backgroundColor = isSold
                          ? seatTypeColors.SOLD
                          : isSelected
                          ? seatTypeColors.SELECTED
                          : seatTypeColors[seat.seat_type] || seatTypeColors.STANDARD;

                          return (
                            <div
                              key={seat.seat_code}
                              className="seat"
                              style={{ backgroundColor }}
                              onClick={() => toggleSeat(seat.seat_code, seat.status)}
                              title={`${seat.seat_code} - ${seat.seat_type}`}
                            >
                              {seat.seat_code}
                            </div>
                          );
                      })}
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                  <p>Không có ghế nào trong phòng này.</p>
                  <p style={{ fontSize: "12px", marginTop: "10px" }}>
                    Debug: seats.length = {seats.length}, sortedRows.length = {sortedRows.length}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3>🍿 Chọn combo đồ ăn</h3>
            {loadingFoods ? (
              <div style={{ padding: "20px", textAlign: "center" }}>Đang tải đồ ăn...</div>
            ) : foods.length > 0 ? (
              <div className="combo-list">
                {foods.map((food) => (
                  <div key={food.food_id} className="combo-item">
                    <img 
                      src={food.food_img?.startsWith('/') ? food.food_img : `/${food.food_img}`} 
                      alt={food.food_name}
                      onError={(e) => {
                        // Fallback nếu ảnh không load được
                        (e.target as HTMLImageElement).src = '/catalog/combo1.jpg';
                      }}
                    />
                    <div className="combo-info">
                      <h4>{food.food_name}</h4>
                      {food.food_description && <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{food.food_description}</p>}
                      <p className="price">{Number(food.food_price).toLocaleString()} VND</p>
                      <div className="quantity">
                        <button onClick={() => handleComboChange(food.food_id, -1)}>−</button>
                        <span>{comboCounts[food.food_id] || 0}</span>
                        <button onClick={() => handleComboChange(food.food_id, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                Không có đồ ăn nào.
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h3>💳 Thanh toán</h3>
            <div className="payment-methods">
              {["VNPAY", "MoMo", "ZaloPay", "ShopeePay"].map((method) => (
                <div key={method}>
                  <input 
                    type="radio" 
                    name="pay" 
                    id={method}
                    value={method}
                    checked={selectedPaymentMethod === method}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  />
                  <label htmlFor={method}>{method}</label>
                </div>
              ))}
            </div>
            {!selectedPaymentMethod && (
              <p style={{ color: '#e62c2c', fontSize: '12px', marginTop: '10px' }}>
                Vui lòng chọn phương thức thanh toán
              </p>
            )}
          </>
        )}
      </div>

      <div className="right-info">
        {showtime && (
          <>
            <h4>{showtime.theater?.theater_name || ""}</h4>
            <p><strong>{showtime.movie?.movie_title || ""}</strong></p>
            {(() => {
              const { time, date } = formatDateTime(showtime.start_time);
              const endTime = formatDateTime(showtime.end_time).time;
              return (
                <p>Suất chiếu: {time} ~{endTime} | {date}</p>
              );
            })()}
            <p>Phòng chiếu: {showtime.room?.room_name || ""}</p>
          </>
        )}

        {selectedSeats.length > 0 && (
          <div className="ticket-info">
            <div className="ticket-item-row">
              {(() => {
                const firstSeatCode = selectedSeats[0];
                const firstSeat = seats.find((s) => s.seat_code === firstSeatCode);
                const seatTypeName = firstSeat?.seat_type === "STANDARD" ? "Thường" :
                                    firstSeat?.seat_type === "VIP" ? "VIP" : "Ghế đôi";
                return (
                  <>
                    <p>
                      {firstSeatCode} - {seatTypeName} - {getSeatPrice(firstSeat?.seat_type || "").toLocaleString()} VND
                    </p>
                    {selectedSeats.length > 1 && (
                      <button 
                        className="dropdown-btn"
                        onClick={() => setShowSeatsDropdown(!showSeatsDropdown)}
                      >
                        {showSeatsDropdown ? '▲' : '▼'} {selectedSeats.length} ghế
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
            
            {showSeatsDropdown && selectedSeats.length > 1 && (
              <div className="dropdown-list">
                {selectedSeats.map((seatCode) => {
                  const seat = seats.find((s) => s.seat_code === seatCode);
                  const seatTypeName = seat?.seat_type === "STANDARD" ? "Thường" :
                                      seat?.seat_type === "VIP" ? "VIP" : "Ghế đôi";
                  return (
                    <p key={seatCode}>
                      {seatCode} - {seatTypeName} - {getSeatPrice(seat?.seat_type || "").toLocaleString()} VND
                    </p>
                  );
                })}
              </div>
            )}
            
            <hr className="divider" />
            <p><strong>Tổng ghế: {totalSeat.toLocaleString()} VND</strong></p>
          </div>
        )}

        {totalCombo > 0 && (
          <>
            <hr className="divider" />
            <div className="combo-summary">
              {(() => {
                const comboEntries = Object.entries(comboCounts).filter(([_, count]) => count > 0);
                if (comboEntries.length === 0) return null;
                
                const [firstFoodId, firstCount] = comboEntries[0];
                const firstFood = foods.find((f) => f.food_id === Number(firstFoodId));
                if (!firstFood) return null;

                const totalComboItems = Object.values(comboCounts).reduce((sum, count) => sum + count, 0);
                const hasMultiple = comboEntries.length > 1 || totalComboItems > firstCount;

                return (
                  <>
                    <div className="combo-item-row">
                      <p>{firstCount} x {firstFood.food_name}</p>
                      <p>{(firstCount * Number(firstFood.food_price)).toLocaleString()} VND</p>
                      {hasMultiple && (
                        <button 
                          className="dropdown-btn"
                          onClick={() => setShowFoodsDropdown(!showFoodsDropdown)}
                        >
                          {showFoodsDropdown ? '▲' : '▼'} {totalComboItems} combo
                        </button>
                      )}
                    </div>
                    
                    {showFoodsDropdown && hasMultiple && (
                      <div className="dropdown-list">
                        {comboEntries.map(([foodId, count]) => {
                          const food = foods.find((f) => f.food_id === Number(foodId));
                          return food && count > 0 ? (
                            <div key={foodId} className="combo-detail">
                              <p>{count} x {food.food_name}</p>
                              <p>{(count * Number(food.food_price)).toLocaleString()} VND</p>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </>
        )}

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
          <button 
            className="next-btn confirm"
            onClick={handlePayment}
            disabled={isProcessingPayment || selectedSeats.length === 0 || !selectedPaymentMethod}
          >
            {isProcessingPayment ? 'Đang xử lý...' : 'THANH TOÁN (4/4)'}
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
