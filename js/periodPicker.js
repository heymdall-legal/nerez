import {html} from "https://unpkg.com/htm/preact/standalone.module.js";
import {getCountedDaysInPeriod, getPeriodLength} from "./utils.js";

export const PeriodPicker = ({from, to, onChange, onRemove, startDate, endDate}) => {
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

            <span>${(from && to) ? `${getPeriodLength(from, to)}, в зачет идет: ${getCountedDaysInPeriod({
                from,
                to
            }, startDate, endDate)}` : ''}</span>
        </div>
    `
}
