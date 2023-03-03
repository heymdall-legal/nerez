import {html, render, useEffect, useState} from 'https://unpkg.com/htm/preact/standalone.module.js'


const Description = () => {
    return html`
        <h1>Nerez калькулятор</h1>
        <p>Быстрый способ понять, являетесь ли вы налоговым резидентом РФ на какую то дату. Просто введите все периоды вашего отсутствия в стране</p>
    `;
}

function getPeriodLength(from, to) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return Math.floor((toDate - fromDate) / MS_PER_DAY);
}

const PeriodPicker = ({ from, to, onChange, onRemove, startDate, endDate }) => {
    const handleInput = (e) => {
        const name = e.target.name;

        onChange({
            from,
            to,
            [name]: e.target.value,
        });
    }

    return html`
        <div class="period-picker">
            <input type="date" name="from" value=${from} onInput=${handleInput} />
            -
            <input type="date" name="to" value=${to} onInput=${handleInput} />
            
            <button type="button" onClick=${onRemove}>🗑️</button>
            
            <span>${(from && to) ? `${getPeriodLength(from, to)}, в зачет идет: ${getCountedDaysInPeriod({from, to}, startDate, endDate)}` : ''}</span>
        </div>
    `
}

const TODAY = new Date().toISOString().split('T')[0];
const yearAgo = new Date();
yearAgo.setFullYear(new Date().getFullYear() - 1);
const YEAR_AGO =  yearAgo.toISOString().split('T')[0];
const LS_KEY = 'periods';
const storedPeriods = localStorage.getItem(LS_KEY) ? JSON.parse(localStorage.getItem(LS_KEY)) : [];

function getCountedDaysInPeriod(period, startDate, endDate) {
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

function getDaysCountInPeriod(periods, startDate, endDate) {
    let count = 0;

    periods.forEach(period => {
        count += getCountedDaysInPeriod(period, startDate, endDate);
    });

    return count;
}

function App (props) {
    const [periods, setPeriods] = useState(storedPeriods);
    const [endDate, setEndDate] = useState(TODAY);
    const [startDate, setStartDate] = useState(YEAR_AGO)

    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(periods));
    }, [periods]);

    const handleAddClick = () => {
        setPeriods([
            ...periods,
            {
                from: undefined,
                to: undefined,
            },
        ]);
    }

    function createOnRemoveHandler(index) {
        return () => {
            setPeriods([...periods.slice(0, index), ...periods.slice(index + 1)]);
        }
    }

    function createOnChangeHandler(index) {
        return (period) => {
            setPeriods([...periods.slice(0, index), period, ...periods.slice(index + 1)]);
        }
    }

    function handleEndDateChange(e) {
        setEndDate(e.target.value);
    }
    function handleStartDateChange(e) {
        setStartDate(e.target.value);
    }


    return html`
        <${Description} />
        <p>Нас интересует статус резиденства на период:</p>
        <input type="date" value=${startDate} onInput=${handleStartDateChange} />
        -
        <input type="date" value=${endDate} onInput=${handleEndDateChange} />
        <div>
            <br />
            <button type="button" onClick=${handleAddClick}>+ Добавить период</button>
            <br />

            ${periods.map((period, index) => html`
                <${PeriodPicker}
                        from=${period.from}
                        to=${period.to}
                        onRemove=${createOnRemoveHandler(index)}
                        onChange=${createOnChangeHandler(index)}
                        startDate=${startDate}
                        endDate=${endDate}
                />
            `)}
        </div>

        <h2>Итого: ${getDaysCountInPeriod(periods, startDate, endDate)}</h2>
    `;
}

render(html`<${App} name="World" />`, document.getElementById('app'));
