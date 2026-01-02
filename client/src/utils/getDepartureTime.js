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

  const goingFrom = timeToMinutes(fromStop.goingTime);
  const goingTo = timeToMinutes(toStop.goingTime);

  const returnFrom = timeToMinutes(fromStop.returnTime);
  const returnTo = timeToMinutes(toStop.returnTime);

  if (goingFrom < goingTo) {
    return {
      direction: "going",
      time: fromStop.goingTime
    };
  }

  if (returnFrom < returnTo) {
    return {
      direction: "return",
      time: fromStop.returnTime
    };
  }

  return null;
}
