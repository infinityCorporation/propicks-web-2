export function eventTimeCheck(timeString: any) {
    const targetTime = new Date(timeString);

    const fourHoursLater = targetTime.getTime() + (4 * 60 * 60 * 1000);

    const now = Date.now();

    return now > fourHoursLater;
}