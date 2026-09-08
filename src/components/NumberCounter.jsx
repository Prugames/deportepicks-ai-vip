import React, { useEffect, useState, useRef } from 'react';

export default function NumberCounter({ value = 0, duration = 600, decimals = 0, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const currentValRef = useRef(0);

  useEffect(() => {
    let animId = null;
    let startTimestamp = null;
    const startVal = currentValRef.current;
    const targetVal = parseFloat(value) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = startVal + (targetVal - startVal) * progress;
      currentValRef.current = current;
      setDisplayValue(current);
      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      }
    };

    animId = window.requestAnimationFrame(step);
    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [value, duration]);

  return (
    <span className="tabular-numbers">
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}
