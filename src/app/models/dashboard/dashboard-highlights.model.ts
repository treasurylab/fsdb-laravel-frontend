import { StringParser } from "src/app/core/utilities/string-parser.class";

export class DashboardHighlights {
    fundHouseTrack: number;
    fundHouseTotal: number;
    schemeTrack: number;
    schemeActive: number;
    schemeTotal: number;
    unmappedNavClassId: number;
    totalNavClassId: number;
    foundNav: number;
    missingNav: number;
    lastUpdate: string;

    constructor(jsonData: any) {
        this.fundHouseTrack = jsonData["fundhouse"];
        this.fundHouseTotal = jsonData["fundhsgtotal"];
        this.schemeTrack = jsonData["scheme"];
        this.schemeActive = jsonData["unpulled_scheme"];
        this.schemeTotal = jsonData["schemetotal"];
        this.unmappedNavClassId = jsonData["unmapped_classid"];
        this.totalNavClassId = jsonData["scheme"];
        this.foundNav = parseInt(jsonData["pulled_nav"]);
        this.missingNav = parseInt(jsonData["unpulled_nav"]);
        this.lastUpdate = StringParser.parseDate(jsonData["lastupdated"]);
    }
}
