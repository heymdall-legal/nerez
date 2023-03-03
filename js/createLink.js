export function createLink(periods, startDate, endDate) {
    const currentBaseUrl = new URL(window.location.href);

    const params = new URLSearchParams();
    params.set('start', startDate);
    params.set('end', endDate);
    params.set('periods', JSON.stringify(periods));

    currentBaseUrl.search = params.toString();

    return currentBaseUrl.toString();
}
