"use client";

import { useState } from "react";
import "@/styles/components/movieDetail.scss";
import Image from "next/image";
import SeatSelection from "@/components/SeatSelection";

export default function MovieDetail() {
  const [selectedDate, setSelectedDate] = useState("02/07");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const days = [
    { label: "Hôm Nay", date: "02/07" },
    { label: "Thứ Năm", date: "03/07" },
    { label: "Thứ Sáu", date: "04/07" },
    { label: "Thứ Bảy", date: "05/07" },
    { label: "Chủ Nhật", date: "06/07" },
  ];

  const schedules = [
    {
      date: "02/07",
      theater: "Galaxy Nguyễn Du",
      format: "2D Lồng Tiếng",
      times: ["16:30", "18:30"],
    },
    {
      date: "03/07",
      theater: "Galaxy Nguyễn Du",
      format: "2D Lồng Tiếng",
      times: ["14:00", "19:00"],
    },
    {
      date: "04/07",
      theater: "Galaxy Nguyễn Du",
      format: "2D Phụ Đề",
      times: ["10:00", "13:30", "18:45"],
    },
  ];

  const todaySchedule = schedules.find((s) => s.date === selectedDate);

  return (
    <div className="movie-detail-page">
      <div className="movie-banner">
        <video src="/elio-trailer.mp4" autoPlay muted loop playsInline />
      </div>

      <div className="movie-content">
        <div className="poster">
          <Image
            src="/ut-lan.jpg"
            alt="Poster"
            width={350}
            height={400}
            priority
          />
        </div>

        <div className="details">
          <h1>Elio Cậu Bé Đến Từ Trái Đất</h1>
          <div className="sub-info">
            <span>⏱ 97 Phút</span>
            <span>📅 27/06/2025</span>
            <span>⭐ 8.4 <small>(83 votes)</small></span>
          </div>
          <p><strong>Quốc gia:</strong> Mỹ</p>
          <p><strong>Nhà sản xuất:</strong> PIXAR, Walt Disney Pictures</p>
          <p><strong>Thể loại:</strong> <span className="tag">Hoạt Hình</span> <span className="tag">Phiêu Lưu</span> <span className="tag">Hài</span> <span className="tag">Giả Tưởng</span></p>
          <p><strong>Đạo diễn:</strong> Adrian Molina, Madeline Sharafian, Domee Shi</p>
          <p><strong>Diễn viên:</strong> Yonas Kibreab, Zoe Saldana, Brad Garrett</p>
        </div>
      </div>

      <div className="movie-description">
        <h3>📘 Nội Dung Phim</h3>
        <p>
          Elio là một cậu bé đam mê vũ trụ với trí tưởng tượng phong phú... <br />
          Phim mới <strong>Elio / Elio Cậu Bé Đến Từ Trái Đất</strong> suất chiếu sớm 21–22.06 dự kiến ra mắt tại các rạp chiếu phim toàn quốc từ 27.06.2025.
        </p>
      </div>

      <div className="showtime-section">
        <h3>🕓 Lịch Chiếu</h3>

        <div className="date-tabs">
          {days.map((day) => (
            <button
              key={day.date}
              className={`tab-button ${selectedDate === day.date ? "active" : ""}`}
              onClick={() => {
                setSelectedDate(day.date);
                setSelectedTime(null);
              }}
            >
              <strong>{day.label}</strong>
              <br />
              {day.date}
            </button>
          ))}
        </div>

        {todaySchedule ? (
          <div className="cinema">
            <h4>{todaySchedule.theater}</h4>
            <div className="showtimes">
              <span>{todaySchedule.format}:</span>
              {todaySchedule.times.map((time) => (
                <button key={time} onClick={() => setSelectedTime(time)}>
                  {time}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-schedule">Không có lịch chiếu cho ngày này.</p>
        )}
      </div>

     {selectedTime && (
        <SeatSelection />
      )}

    </div>
  );
}
