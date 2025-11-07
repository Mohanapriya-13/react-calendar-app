import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import CalendarGrid from "./components/CalendarGrid";
import staticEvents from "./data/events.json";

function App() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("calendarEvents");
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      setEvents(staticEvents);
      localStorage.setItem("calendarEvents", JSON.stringify(staticEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const goToPrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const goToNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const handleAddEvent = (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    if (!title) return alert("Please enter an event title.");

    const dateValue = e.target.date.value || dayjs().format("YYYY-MM-DD");
    const startTime = e.target.startTime.value || "00:00";
    const endTime = e.target.endTime.value || "23:59";

    const newEvent = {
      id: Date.now(),
      title,
      date: dateValue,
      startTime,
      endTime,
      color: "#4a90e2",
    };

    setEvents([...events, newEvent]);
    setShowForm(false);
    e.target.reset();
  };

  const handleDeleteEvent = (id) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (confirmDelete) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <div className="month-nav">
          <button onClick={goToPrevMonth}>&lt;</button>
          <h2>{currentDate.format("MMM YYYY")}</h2>
          <button onClick={goToNextMonth}>&gt;</button>
        </div>
        <button className="add-event-btn" onClick={() => setShowForm(true)}>
          Add Event
        </button>
      </div>

      <CalendarGrid
        currentDate={currentDate}
        events={events}
        onDeleteEvent={handleDeleteEvent}
      />

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Event</h3>
            <form onSubmit={handleAddEvent} className="event-form">
              <label>
                Event Title
                <input type="text" name="title" required />
              </label>

              <label>
                Date (optional)
                <input type="date" name="date" />
              </label>

              <label>
                Start Time (optional)
                <input type="time" name="startTime" />
              </label>

              <label>
                End Time (optional)
                <input type="time" name="endTime" />
              </label>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
