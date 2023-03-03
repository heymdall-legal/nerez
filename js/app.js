import {html, useState} from "https://unpkg.com/htm/preact/standalone.module.js";
import {getDaysCountInPeriod, LS_KEY, useLocalstorageSaver} from "./utils.js";
import {Description} from "./description.js";
import {PeriodPicker} from "./periodPicker.js";
import {createLink} from "./createLink.js";

export function App(defaults) {
    const [periods, setPeriods] = useState(defaults.periods);
    const [startDate, setStartDate] = useState(defaults.startDate);
    const [endDate, setEndDate] = useState(defaults.endDate);

    useLocalstorageSaver(LS_KEY, periods);

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

        <p>Если вы не проживали в РФ более 183 дней в течении года, то вы не являетесь налоговым резидентом РФ</p>

        Ссылка на расчет:
        <a href=${createLink(periods, startDate, endDate)}>тут</a>

    `;
}
