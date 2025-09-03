"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SeatSelection from "@/components/SeatSelection";
import ModalTrailer from "@/components/ModalTrailer";
import "@/styles/components/movieDetail.scss";

interface Genre {
  name: string;
}

interface MovieGenre {
  genre: Genre;
}

interface Movie {
  movie_title: string;
  movie_poster: string;
  movie_trailer: string;
  duration: number;
  release_date: string;
  movie_review: string;
  country: string;
  movie_producer: string;
  directors: string;
  cast: string;
  movie_description?: string;
  movieGenres: MovieGenre[];
}

export default function MovieDetail({ slug }: { slug: string }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState("02/07");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`http://localhost:3000/movie/${slug}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch movie");

        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Error loading movie:", error);
      }
    }

    fetchMovie();
  }, [slug]);

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

  if (!movie) return <div>Đang tải thông tin phim...</div>;

  return (
    <div className="movie-detail-page">
      <div className="movie-banner-container">
        <div className="movie-banner">
          <video
            src={movie.movie_trailer.startsWith('/') ? movie.movie_trailer : `/${movie.movie_trailer}`}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button className="play-button" onClick={() => setShowTrailer(true)}>▶</button>
        </div>

        <div className="movie-content">
          <div className="poster" style={{ position: "relative", top: "-80px" }}>
            <Image
              src={movie.movie_poster.startsWith("/") ? movie.movie_poster : `/${movie.movie_poster}`}
              alt="Poster"
              width={300}
              height={400}
              className="poster-image"
              priority
            />
          </div>

          <div className="details">
            <h1>{movie.movie_title}</h1>
            <div className="sub-info">
              <span>⏱ {movie.duration} Phút</span>
              <span>📅 {movie.release_date}</span>
              <span>⭐ {movie.movie_review}</span>
            </div>
            <p><strong>Quốc gia:</strong> {movie.country}</p>
            <p><strong>Nhà sản xuất:</strong> {movie.movie_producer}</p>
            <p><strong>Thể loại:</strong>
              {movie.movieGenres?.map((mg, index) => (
                <span key={index} className="tag">{mg.genre.name}</span>
              ))}
            </p>
            <p><strong>Đạo diễn:</strong> {movie.directors}</p>
            <p><strong>Diễn viên:</strong> {movie.cast}</p>
          </div>
        </div>
      </div>

      <div className="movie-description">
        <h3>📘 Nội Dung Phim</h3>
        <p>{movie.movie_description || "Nội dung chi tiết về phim sẽ được cập nhật."}</p>
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

      {selectedTime && <SeatSelection />}

      {showTrailer && <ModalTrailer url={movie.movie_trailer.startsWith('/') ? movie.movie_trailer : `/${movie.movie_trailer}`} onClose={() => setShowTrailer(false)} />}
    </div>
  );
}