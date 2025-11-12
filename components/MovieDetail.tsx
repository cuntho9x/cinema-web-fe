"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import SeatSelection from "@/components/SeatSelection";
import ModalTrailer from "@/components/ModalTrailer";
import "@/styles/components/movieDetail.scss";

axios.defaults.withCredentials = true;

interface Genre {
  name: string;
}

interface MovieGenre {
  genre: Genre;
}

interface Movie {
  movie_id: number;
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

interface Theater {
  theater_name: string;
}

interface Room {
  room_name: string;
}

interface ScheduleShowtime {
  id: number;
  movie_id: number;
  show_date: string; 
  start_time: string; 
  end_time: string; 
  graphics_type: string;
  translation_type: string;
  theater: Theater;
  room: Room;
}

export default function MovieDetail({ slug }: { slug: string }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedScheduleShowtimeId, setSelectedScheduleShowtimeId] = useState<number | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showtimes, setShowtimes] = useState<ScheduleShowtime[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get('http://localhost:3000/auth/me', {
          withCredentials: true,
        });
        setIsAuthenticated(!!res.data);
      } catch (error) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchMovieAndShowtimes() {
      try {
        const res = await fetch(`http://localhost:3000/movie/${slug}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch movie");

        const movieData: Movie = await res.json();
        setMovie(movieData);

        // Fetch schedule showtimes filtered by movieId
        const stRes = await fetch(`http://localhost:3000/schedule-showtime?movieId=${movieData.movie_id}`, {
          cache: "no-store",
        });
        if (stRes.ok) {
          const showtimesData: ScheduleShowtime[] = await stRes.json();
          // Sort by date/time asc for determinism
          showtimesData.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
          setShowtimes(showtimesData);

          // Initialize selectedDate to the first available date
          const firstDate = showtimesData.length
            ? formatDateKey(showtimesData[0].show_date)
            : null;
          setSelectedDate(firstDate);
        } else {
          console.error("Failed to fetch showtimes:", stRes.status, stRes.statusText);
          setShowtimes([]);
        }
      } catch (error) {
        console.error("Error loading movie/showtimes:", error);
      }
    }

    fetchMovieAndShowtimes();
  }, [slug]);
  // Helpers to render day tabs derived from real showtimes
  // Parse date from string to avoid timezone issues
  function parseDateString(dateStr: string): { day: number; month: number; year: number } {
    // Handle various date formats: "2025-11-07T00:00:00.000Z", "2025-11-07 00:00:00", etc.
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      return {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
      };
    }
    // Fallback: try parsing as Date (may have timezone issues)
    const d = new Date(dateStr);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate(),
    };
  }

  function formatDateKey(dateStr: string | Date): string {
    let day: number, month: number;
    
    if (typeof dateStr === 'string') {
      const parsed = parseDateString(dateStr);
      day = parsed.day;
      month = parsed.month;
    } else {
      // If it's already a Date object, use UTC methods to avoid timezone issues
      day = dateStr.getUTCDate();
      month = dateStr.getUTCMonth() + 1;
    }
    
    const dd = String(day).padStart(2, "0");
    const mm = String(month).padStart(2, "0");
    return `${dd}/${mm}`;
  }

  function toTitleCaseWeekday(weekday: string) {
    if (!weekday) return weekday;
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }

  // Parse datetime string and extract time without timezone conversion
  // Format: "2025-06-05 20:25:00.000" or ISO format
  function parseTimeFromDateTime(dateTimeStr: string): string {
    // If it's in format "YYYY-MM-DD HH:mm:ss.mmm", parse it directly from string
    // This preserves the exact time as stored in database without timezone conversion
    const match = dateTimeStr.match(/(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, , , , hour, minute] = match;
      return `${hour}:${minute}`;
    }
    
    // Fallback: if format doesn't match, try parsing as Date
    // This handles edge cases but may have timezone issues
    const date = new Date(dateTimeStr);
    if (!isNaN(date.getTime())) {
      // Check if the string contains timezone info
      // If it's an ISO string with timezone, we need to extract the local time part
      // For example: "2025-06-05T20:25:00.000+07:00" should show 20:25
      const isoMatch = dateTimeStr.match(/T(\d{2}):(\d{2}):(\d{2})/);
      if (isoMatch) {
        const [, hour, minute] = isoMatch;
        return `${hour}:${minute}`;
      }
      // Last resort: use UTC hours/minutes
      const hour = String(date.getUTCHours()).padStart(2, "0");
      const minute = String(date.getUTCMinutes()).padStart(2, "0");
      return `${hour}:${minute}`;
    }
    
    return "00:00"; // Fallback
  }

  // Format graphics type and translation type for display
  function formatShowtimeType(graphicsType: string, translationType: string): string {
    // Map graphics type (handle various formats)
    let graphics = "";
    const gType = graphicsType?.toUpperCase() || "";
    if (gType === "TWO_D" || gType === "2D" || gType === "D") {
      graphics = "2D";
    } else if (gType === "THREE_D" || gType === "3D") {
      graphics = "3D";
    } else if (gType === "IMAX") {
      graphics = "IMAX";
    } else {
      // Fallback: try to clean up the value
      graphics = graphicsType?.replace("TWO_D", "2D")
        .replace("THREE_D", "3D") || graphicsType || "";
    }

    // Map translation type (handle various formats)
    let translation = "";
    const tType = translationType || "";
    if (tType === "LongTieng" || tType === "Lồng Tiếng" || tType.toLowerCase().includes("longtieng")) {
      translation = "Lồng Tiếng";
    } else if (tType === "PhuDe" || tType === "Phụ Đề" || tType.toLowerCase().includes("phude")) {
      translation = "Phụ Đề";
    } else {
      translation = translationType || "";
    }

    // Combine with format: "2D - Lồng Tiếng" or "IMAX - Phụ Đề"
    return `${graphics} - ${translation}`;
  }

  const uniqueDays = Array.from(
    new Map(
      showtimes.map((s) => {
        const parsed = parseDateString(s.show_date);
        const key = formatDateKey(s.show_date);
        
        // Create date object for comparison (using UTC to avoid timezone issues)
        const d = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        const isToday = d.getTime() === todayUTC.getTime();
        
        // Format weekday (using UTC date)
        const weekday = new Intl.DateTimeFormat("vi-VN", { 
          weekday: "long",
          timeZone: "UTC"
        }).format(d);
        const label = isToday ? "Hôm Nay" : toTitleCaseWeekday(weekday);
        return [key, { label, date: key, year: parsed.year, month: parsed.month, day: parsed.day }] as const;
      })
    ).values()
  ).sort((a, b) => {
    // Sort by actual date (year, month, day)
    if (a.year !== b.year) return a.year - b.year;
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });

  // Group showtimes for the selected day by theater first, then by format
  const showtimesForSelectedDay = (selectedDate
    ? showtimes.filter((s) => formatDateKey(s.show_date) === selectedDate)
    : []);

  // First group by theater, then by format within each theater
  type TheaterGroup = {
    theaterName: string;
    formats: Array<{
      format: string;
      times: Array<{ time: string; scheduleShowtimeId: number } | string>; // Support both for backward compat
    }>;
  };

  const groupedByTheater = showtimesForSelectedDay.reduce(
    (acc, st) => {
      const theaterName = st.theater?.theater_name ?? "";
      const format = formatShowtimeType(st.graphics_type, st.translation_type);
      const time = parseTimeFromDateTime(st.start_time);

      if (!acc[theaterName]) {
        acc[theaterName] = {
          theaterName,
          formats: [],
        };
      }

      // Find or create format group within this theater
      let formatGroup = acc[theaterName].formats.find((f) => f.format === format);
      if (!formatGroup) {
        formatGroup = { format, times: [] };
        acc[theaterName].formats.push(formatGroup);
      }

      // Add time with schedule_showtime_id if not already present (avoid duplicates)
      const timeObj = { time, scheduleShowtimeId: st.id };
      const existingTime = formatGroup.times.find((t) => 
        typeof t === 'object' ? t.time === time : t === time
      );
      if (!existingTime) {
        formatGroup.times.push(timeObj);
      } else if (typeof existingTime === 'string') {
        // Replace string with object if it exists
        const index = formatGroup.times.indexOf(existingTime);
        formatGroup.times[index] = timeObj;
      }

      // Sort times within each format
      formatGroup.times.sort((a, b) => {
        const timeA = typeof a === 'object' ? a.time : a;
        const timeB = typeof b === 'object' ? b.time : b;
        return timeA.localeCompare(timeB);
      });

      return acc;
    },
    {} as Record<string, TheaterGroup>
  );

  const schedulesForRender = Object.values(groupedByTheater);

  if (!movie) return <div>Đang tải thông tin phim...</div>;

  return (
    <div className="movie-detail-page">
      <div className="movie-banner-container">
        <div className="movie-banner">
          <video
            src={movie.movie_trailer.startsWith('/movie/') ? movie.movie_trailer : `/movie/${movie.movie_trailer}`}
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
              src={movie.movie_poster.startsWith("/") 
                ? (movie.movie_poster.startsWith("/movie/") ? movie.movie_poster : `/movie${movie.movie_poster}`)
                : `/movie/${movie.movie_poster}`}
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
          {uniqueDays.map((day) => (
            <button
              key={day.date}
              className={`tab-button ${selectedDate === day.date ? "active" : ""}`}
              onClick={() => {
                setSelectedDate(day.date);
                setSelectedScheduleShowtimeId(null);
              }}
            >
              <strong>{day.label}</strong>
              <br />
              {day.date}
            </button>
          ))}
        </div>

        {schedulesForRender.length > 0 && (
          <div className="theaters-list">
            <h4 className="theaters-header">Danh sách rạp đề xuất</h4>
            <div className="theaters-container">
              {schedulesForRender.map((theaterGroup) => (
                <div className="cinema-card" key={theaterGroup.theaterName}>
                  <h4 className="theater-name">{theaterGroup.theaterName}</h4>
                  {theaterGroup.formats.map((formatGroup) => (
                    <div className="format-group" key={formatGroup.format}>
                      <span className="format-label">{formatGroup.format}</span>
                      <div className="showtimes-grid">
                        {formatGroup.times.map((timeObj) => {
                          const time = typeof timeObj === 'object' ? timeObj.time : timeObj;
                          const scheduleShowtimeId = typeof timeObj === 'object' ? timeObj.scheduleShowtimeId : null;
                          return (
                            <button
                              key={time}
                              className="time-button"
                              onClick={() => {
                                if (scheduleShowtimeId) {
                                  // Kiểm tra authentication trước khi mở seat selection
                                  if (isAuthenticated === false) {
                                    // Chưa đăng nhập, hiển thị modal yêu cầu đăng nhập
                                    setShowLoginModal(true);
                                    return;
                                  }
                                  // Đã đăng nhập, mở seat selection
                                  setSelectedScheduleShowtimeId(scheduleShowtimeId);
                                }
                              }}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {schedulesForRender.length === 0 && (
          <p className="no-schedule">Không có lịch chiếu cho ngày này.</p>
        )}
      </div>

      {/* Modal yêu cầu đăng nhập */}
      {showLoginModal && (
        <div className="modal-seat-selection">
          <div className="modal-backdrop" onClick={() => setShowLoginModal(false)}></div>
          <div className="modal-seat-content" style={{ maxWidth: '400px', padding: '30px' }}>
            <button className="close-button" onClick={() => setShowLoginModal(false)}>✖</button>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>🔐 Yêu cầu đăng nhập</h3>
              <p style={{ marginBottom: '20px', color: '#666' }}>
                Vui lòng đăng nhập để đặt vé và thanh toán.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    router.push('/login');
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#60c280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#e0e0e0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedScheduleShowtimeId && (
        <div className="modal-seat-selection">
          <div className="modal-backdrop" onClick={() => setSelectedScheduleShowtimeId(null)}></div>
          <div className="modal-seat-content">
            <button className="close-button" onClick={() => setSelectedScheduleShowtimeId(null)}>✖</button>
            <SeatSelection scheduleShowtimeId={selectedScheduleShowtimeId} />
          </div>
        </div>
      )}

      {showTrailer && <ModalTrailer url={movie.movie_trailer.startsWith('/') ? movie.movie_trailer : `/${movie.movie_trailer}`} onClose={() => setShowTrailer(false)} />}
    </div>
  );
}