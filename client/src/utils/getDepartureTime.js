function timeToMinutes(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function getDepartureTime(stoppages, from, to) {
  if (!stoppages || !from || !to) return null;

  const fromStop = stoppages.find(
    s => s.name.toLowerCase() === from.toLowerCase()
  );
  const toStop = stoppages.find(
    s => s.name.toLowerCase() === to.toLowerCase()
  );

  if (!fromStop || !toStop) return null;

  if (fromStop.order === toStop.order) {
    return null; // same stop not allowed
  }

  // ✅ UP JOURNEY
  if (fromStop.order < toStop.order) {
    return {
      direction: "going",
      time: fromStop.goingTime
    };
  }

  // ✅ DOWN JOURNEY
  return {
    direction: "return",
    time: fromStop.returnTime
  };
}
