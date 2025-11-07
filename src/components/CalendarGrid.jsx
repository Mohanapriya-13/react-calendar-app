import React from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(weekday);
dayjs.extend(customParseFormat);

function CalendarGrid({ currentDate, events, onDeleteEvent }) {
  const processEventsForConflicts = (dayEvents) => {
    if (dayEvents.length <= 1) return dayEvents;

    const processed = dayEvents.map((event) => {
      const start = dayjs(event.startTime, "HH:mm");
      const end = dayjs(event.endTime, "HH:mm");
      return { ...event, startObj: start, endObj: end, isConflicting: false };
    });

    for (let i = 0; i < processed.length; i++) {
      for (let j = i + 1; j < processed.length; j++) {
        const A = processed[i];
        const B = processed[j];
        const overlap =
          A.startObj.isBefore(B.endObj) && B.startObj.isBefore(A.endObj);
        if (overlap) {
          A.isConflicting = true;
          B.isConflicting = true;
        }
      }
    }
    return processed;
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = [];

  const eventsByDate = events.reduce((acc, ev) => {
    const key = dayjs(ev.date).format("YYYY-MM-DD");
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  const firstDay = currentDate.startOf("month").day();
  const daysInMonth = currentDate.daysInMonth();
  const today = dayjs();

  for (let i = 0; i < firstDay; i++) calendarDays.push({ type: "empty" });

  for (let i = 1; i <= daysInMonth; i++) {
    const day = currentDate.date(i);
    const isToday = day.isSame(today, "day");
    const dateKey = day.format("YYYY-MM-DD");
    const dayEvents = processEventsForConflicts(eventsByDate[dateKey] || []);
    calendarDays.push({ type: "day", date: day, isToday, events: dayEvents });
  }

  while (calendarDays.length < 42) calendarDays.push({ type: "empty" });

  return (
    <div className="calendar-grid-container">
      <div className="week-days-header">
        {weekDays.map((d) => (
          <div
            key={d}
            className="week-day-name">
            {d}
          </div>
        ))}
      </div>

      <div className="calendar-dates">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`date-cell ${
              day.isToday ? "is-today" : ""
            } ${day.type === "empty" ? "empty-cell" : ""}`}
            data-day={day.date ? day.date.date() : ""}
          >
            {day.events &&
              day.events.map((ev) => (
                <div
                  key={ev.id}
                  className={`calendar-event ${
                    ev.isConflicting ? "event-conflict" : ""
                  }`}
                  style={{ backgroundColor: ev.color || "#333" }}
                >
                  <span>{ev.title}</span>
                  <button
                    className="delete-btn"
                    onClick={() => onDeleteEvent(ev.id)}
                    title="Delete event"
                  >
                    🗑️
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarGrid;
