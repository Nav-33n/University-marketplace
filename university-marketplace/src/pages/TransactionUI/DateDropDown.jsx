import { useState } from "react";

function DateDropdown({ selectedDate, setSelectedDate }) {
  const handleChange = (e) => {
    setSelectedDate(e.target.value);
    console.log("Selected date:", e.target.value);
  };

  return (
    <div>
      <label htmlFor="dateSelect" className="text-black">
        Select Date:{" "}
      </label>
      <select
        id="dateSelect"
        className="bg-amber-400 text-black p-2 rounded"
        value={selectedDate}
        onChange={handleChange}
      >
        <option value="">-- Choose --</option>
        {[...Array(7)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      {selectedDate && (
        <p className="text-black">You selected: {selectedDate}</p>
      )}
    </div>
  );
}

export default DateDropdown;
