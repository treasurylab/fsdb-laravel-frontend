import { StringParser } from "src/app/core/utilities/string-parser.class";

export class EquityListDetails {
    masterEquity: number;
    trackingEquity: number;
    mappedIssuer: number;
    trackingIssuer: number;
    unmappedIssuer: number;
    mtmRateUpdated: number;
    missingMtmRateEquity: number;
    lastUpdateMtmRate: string;
    lastUpdatedCorpAction: string;

    constructor(jsonData: any) {
        this.masterEquity = jsonData["total"];
        this.trackingEquity = jsonData["tracking"];
        this.mappedIssuer = jsonData["total_bp"];
        this.trackingIssuer = jsonData["tracking_bp"];
        this.unmappedIssuer = jsonData["total"] - jsonData["total_bp"];
        this.mtmRateUpdated = jsonData["bhav"];
        this.missingMtmRateEquity = jsonData["tracking"] - jsonData["bhav"];
        this.lastUpdateMtmRate = StringParser.parseDate(jsonData["date1"]);
        this.lastUpdatedCorpAction = StringParser.parseDate(jsonData["corp"]);
    }
}
