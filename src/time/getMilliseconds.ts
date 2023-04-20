/**
 * 把天数、小时数，分钟数转换毫秒数
 *
 * @example
 *
 * const fn = t.getMilliseconds;
 *
 * fn(); // 0
 * fn({ seconds: 1 }); // 1000
 * fn({ seconds: 1.5 }); // 1500
 * fn({ seconds: 60 }); // 1000 * 60
 * fn({ minutes: 1 }); // 1000 * 60
 * fn({ minutes: 1.5 }); // 1000 * 90
 * fn({ minutes: 1 }); // === fn({ seconds: 60 })
 * fn({ minutes: 1.5 }); // === fn({ seconds: 90 })
 * fn({ hours: 1 }); // === fn({ minutes: 60 })
 * fn({ days: 1 }); // === fn({ hours: 24 })
 * fn({ days: 1.5 }); // === fn({ hours: 36 })
 *
 * @param [days=0]
 * @param [hours=0]
 * @param [minutes=0]
 * @param [seconds=0]
 */
export function getMilliseconds({
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
} = {}): number {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  let result = seconds * second;
  result += minutes * minute;
  result += hours * hour;
  result += days * hour * 24;
  return result;
}
