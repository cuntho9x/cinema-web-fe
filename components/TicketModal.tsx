"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import "@/styles/components/ticketModal.scss";
// QRCode component - simple placeholder
const QRCode = ({ value, size }: { value: string; size: number }) => {
  // Placeholder QR code - display as black square with text
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "0.6rem",
        textAlign: "center",
        padding: "0.5rem",
        wordBreak: "break-all",
        fontFamily: "monospace",
        borderRadius: "4px",
      }}
    >
      QR
      <br />
      {value.substring(0, 8)}
    </div>
  );
};

interface TicketModalProps {
  orderId: number | null;
  onClose: () => void;
}

interface OrderDetail {
  order_id: number;
  order_date: string;
  total_price: number;
  scheduleShowtime: {
    id: number;
    show_date: string;
    start_time: string;
    end_time: string;
    movie: {
      movie_id: number;
      movie_title: string;
      movie_poster: string | null;
      duration: number;
      age_restriction: string;
      movieGenres: Array<{
        genre: {
          name: string;
        };
      }>;
    };
    theater: {
      theater_id: number;
      theater_name: string;
      theater_address: string | null;
    };
    room: {
      room_id: number;
      room_name: string;
    };
  };
  tickets: Array<{
    ticket_id: number;
    ticket_code: string;
    seat: {
      seat_code: string;
    };
  }>;
}

export default function TicketModal({ orderId, onClose }: TicketModalProps) {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrderDetail() {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/order/${orderId}`,
          { withCredentials: true }
        );
        setOrderDetail(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching order detail:", err);
        setError("Không thể tải thông tin vé");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetail();
  }, [orderId]);

  if (!orderId) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getSeats = () => {
    if (!orderDetail) return "";
    return orderDetail.tickets
      .map((t) => t.seat.seat_code)
      .join(", ");
  };

  const getGenres = () => {
    if (!orderDetail) return "";
    return orderDetail.scheduleShowtime.movie.movieGenres
      .map((mg) => mg.genre.name)
      .join(", ");
  };

  const getTicketCode = () => {
    if (!orderDetail || orderDetail.tickets.length === 0) return "";
    return orderDetail.tickets[0].ticket_code;
  };

  return (
    <div className="ticket-modal-overlay" onClick={onClose}>
      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {loading && (
          <div className="loading">Đang tải thông tin vé...</div>
        )}

        {error && (
          <div className="error">{error}</div>
        )}

        {orderDetail && !loading && (
          <>
            {/* Header - Cinema Info */}
            <div className="ticket-header">
              <div className="cinema-logo">
                <div className="logo-text">
                  <span className="logo-beta">beta</span>
                  <span className="logo-cinemas">cinemas</span>
                </div>
              </div>
              <div className="cinema-info">
                <h2 className="cinema-name">
                  {orderDetail.scheduleShowtime.theater.theater_name}
                </h2>
                {orderDetail.scheduleShowtime.theater.theater_address && (
                  <p className="cinema-address">
                    {orderDetail.scheduleShowtime.theater.theater_address}
                  </p>
                )}
              </div>
            </div>

            <div className="ticket-divider"></div>

            {/* Movie Info */}
            <div className="ticket-movie">
              <div className="movie-poster">
                {orderDetail.scheduleShowtime.movie.movie_poster ? (
                  <Image
                    src={
                      orderDetail.scheduleShowtime.movie.movie_poster.startsWith("http")
                        ? orderDetail.scheduleShowtime.movie.movie_poster
                        : orderDetail.scheduleShowtime.movie.movie_poster.startsWith("/")
                        ? (orderDetail.scheduleShowtime.movie.movie_poster.startsWith("/movie/") 
                            ? orderDetail.scheduleShowtime.movie.movie_poster 
                            : `/movie${orderDetail.scheduleShowtime.movie.movie_poster}`)
                        : `/movie/${orderDetail.scheduleShowtime.movie.movie_poster}`
                    }
                    alt={orderDetail.scheduleShowtime.movie.movie_title}
                    width={120}
                    height={180}
                    unoptimized
                  />
                ) : (
                  <div className="no-poster">No Poster</div>
                )}
              </div>
              <div className="movie-details">
                <h3 className="movie-title">
                  {orderDetail.scheduleShowtime.movie.movie_title}
                </h3>
                <p className="movie-genres">{getGenres()}</p>
                <div className="movie-badges">
                  <span className="badge duration">
                    {orderDetail.scheduleShowtime.movie.duration} phút
                  </span>
                  <span className="badge age">
                    {orderDetail.scheduleShowtime.movie.age_restriction}
                  </span>
                </div>
                <div className="showtime-info">
                  <div className="info-row">
                    <div className="info-col">
                      <span className="info-label">Ngày chiếu</span>
                      <span className="info-value">
                        {formatDate(orderDetail.scheduleShowtime.show_date)}
                      </span>
                    </div>
                    <div className="info-col">
                      <span className="info-label">Suất chiếu</span>
                      <span className="info-value">
                        {formatTime(orderDetail.scheduleShowtime.start_time)}
                      </span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-col">
                      <span className="info-label">Phòng chiếu</span>
                      <span className="info-value">
                        {orderDetail.scheduleShowtime.room.room_name}
                      </span>
                    </div>
                    <div className="info-col">
                      <span className="info-label">
                        Số ghế ({orderDetail.tickets.length})
                      </span>
                      <span className="info-value">{getSeats()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ticket-divider"></div>

            {/* Ticket Code & QR */}
            <div className="ticket-footer">
              <div className="qr-code">
                <QRCode value={getTicketCode()} size={120} />
              </div>
              <div className="ticket-code-info">
                <span className="code-label">Mã vé</span>
                <span className="code-value">{getTicketCode()}</span>
                <div className="code-actions">
                  <button
                    className="action-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(getTicketCode());
                      alert("Đã sao chép mã vé!");
                    }}
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

