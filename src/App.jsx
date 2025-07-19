import { useState, useEffect } from 'react';
import './App.css';

function Clock() {
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [midday, setMidday] = useState('');

  useEffect(() => {
    const days = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    const updateClock = () => {
      const now = new Date();
      let hr = now.getHours();
      const min = now.getMinutes();
      const sec = now.getSeconds();
      let middayValue = hr >= 12 ? 'PM' : 'AM';

      if (hr === 0) hr = 12;
      else if (hr > 12) hr -= 12;

      const format = (n) => (n < 10 ? '0' + n : n);

      setDay(days[now.getDay()]);
      setMidday(middayValue);
      setTime(`${format(hr)}:${format(min)}:${format(sec)}`);
    };

    updateClock(); // Run once on mount
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="box">
      <div className="container">
        <div className="shape1"></div>
        <div className="shape2"></div>
        <div className="clock">
          <div id="day">{day}</div>
          <div className="wrapper">
            <div id="time">{time}</div>
            <div id="midday">{midday}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clock;
