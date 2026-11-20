export function auditBetPercent(percent: any) {
    const rounded_num = Math.round(percent * 100) / 100;
    return rounded_num.toFixed(2);
}