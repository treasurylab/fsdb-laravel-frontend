export class ClassInformation {
    schemeId: string;
    schemeName: string;
    classId: string;
    date: string;

    constructor(jsonData: any) {
        this.schemeId = jsonData["scheme_id"];
        this.schemeName = jsonData["scheme_name"];
        this.classId = jsonData["class_id"];
        this.date = jsonData["adate"];
    }
}
