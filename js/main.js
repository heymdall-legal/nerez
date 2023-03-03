import {html, render} from 'https://unpkg.com/htm/preact/standalone.module.js'
import {LS_KEY} from "./utils.js";
import {App} from "./app.js";

function getDefaultParams() {
    const params = new URLSearchParams(window.location.search);

    let periods = localStorage.getItem(LS_KEY) ? JSON.parse(localStorage.getItem(LS_KEY)) : [];
    let startDate = new Date().toISOString().split('T')[0];
    const yearAgo = new Date();
    yearAgo.setFullYear(new Date().getFullYear() - 1);
    let endDate = yearAgo.toISOString().split('T')[0];

    if (params.has('periods')) {
        periods = JSON.parse(params.get('periods'));
    }

    if (params.has('start')) {
        startDate = params.get('start');
    }

    if (params.has('end')) {
        endDate = params.get('end');
    }

    return {
        periods,
        startDate,
        endDate,
    };
}

const defaults = getDefaultParams();

render(
    html`<${App} ...${defaults} />`,
    document.getElementById('app')
);
