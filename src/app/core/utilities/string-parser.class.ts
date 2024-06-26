export class StringParser {
    static parseDate(dateStr: string, showDate: boolean = true) {
        let date = new Date(dateStr);
        let dateArr = date.toString().split(" ");
        if (showDate) {
            return dateArr[2] + " " + dateArr[1] + " " + dateArr[3];
        } else {
            return dateArr[1] + " " + dateArr[3];
        }
    }
}