import {useEffect} from "https://unpkg.com/htm/preact/standalone.module.js";

export function getPeriodLength(from, to) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return Math.floor((toDate - fromDate) / MS_PER_DAY);
}

export function getCountedDaysInPeriod(period, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let from = new Date(period.from);
    let to = new Date(period.to);

    if (from < start) {
        from = start;
    }

    if (to > end) {
        to = end;
    }

    const len = getPeriodLength(from, to);

    return len < 0 ? 0 : len;
}

export function getDaysCountInPeriod(periods, startDate, endDate) {
    let count = 0;

    periods.forEach(period => {
        count += getCountedDaysInPeriod(period, startDate, endDate);
    });

    return count;
}

export const LS_KEY = 'periods';

export function useLocalstorageSaver(key, value) {
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value]);
}
