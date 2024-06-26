import { StringParser } from "src/app/core/utilities/string-parser.class";

export class MutualFundStatistics {
    expiredScheme: number;
    amfiQuarterlyAumFundHouse: number;
    amfiQuarterlyFundHouseAum: number;
    missingAmfiQuarterlyAumFundHouse: number;
    amfiQuarterlyAumSchemes: number;
    amfiQuarterlySchemesAum: number;
    schemesTracked: number;
    missingNavForSchemes: number;
    lastUpdatedPortfolio: string;
    portfolioUploaded: number;
    lastUpdatedFactsheets: string;
    factsheetsUpdated: number;
    bloombergDataLastUpdated: string;

    constructor(jsonData: any) {
        this.expiredScheme = jsonData["expired"];
        this.amfiQuarterlyAumFundHouse = jsonData["fund_no"];
        this.amfiQuarterlyFundHouseAum = jsonData["fund_aum"];
        this.missingAmfiQuarterlyAumFundHouse = jsonData["unpulled_fund"];
        this.amfiQuarterlyAumSchemes = jsonData["scheme_no"];
        this.amfiQuarterlySchemesAum = jsonData["scheme_aum"];
        this.schemesTracked = jsonData["scheme"];
        this.missingNavForSchemes = jsonData["unpulled_nav"];
        this.lastUpdatedPortfolio = StringParser.parseDate(jsonData["pf_month_pf"], false);
        this.portfolioUploaded = jsonData["pulled_pf"];
        this.lastUpdatedFactsheets = StringParser.parseDate(jsonData["pf_month_ft"], false);
        this.factsheetsUpdated = jsonData["pulled_ft"];
        this.bloombergDataLastUpdated = StringParser.parseDate(jsonData["bloombrg"]);
    }
}
