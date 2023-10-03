"use strict";
/* tslint:disable:no-unused-variable */
Object.defineProperty(exports, "__esModule", { value: true });
var ngx_csv_1 = require("./ngx-csv");
describe('Component: ngx-csv', function () {
    it('should create an file with name My_Report.csv', function () {
        var component = new ngx_csv_1.ngxCsv([{ name: 'test', age: 20 }], 'My Report', { noDownload: true });
        expect(component).toBeTruthy();
    });
    it('should return correct order', function () {
        var component = new ngx_csv_1.ngxCsv([{ name: 'test', age: 20 }], 'My Report', { useBom: false, noDownload: true });
        var csv = component['csv'];
        var csv_rows = csv.split(ngx_csv_1.CsvConfigConsts.EOL);
        var first_row = csv_rows[0].replace(/"/g, '').split(',');
        expect(first_row[0]).toEqual('test');
        expect(first_row[1]).toBe("" + 20);
    });
    it('should return csv with title', function () {
        var component = new ngx_csv_1.ngxCsv([{ name: 'test', age: 20 }], 'My Report', { showTitle: true, useBom: false, noDownload: true });
        var csv = component['csv'];
        var title = csv.split(ngx_csv_1.CsvConfigConsts.EOL)[0];
        expect(title).toEqual('My Report');
    });
    it('should return csv file with custom field separator', function () {
        var component = new ngx_csv_1.ngxCsv([{ name: 'test', age: 20 }], 'My Report', { useBom: false, fieldSeparator: ';', noDownload: true });
        var csv = component['csv'];
        var first_row = csv.split(ngx_csv_1.CsvConfigConsts.EOL)[0];
        expect(first_row.split(';').length).toBe(2);
    });
    it('should return csv file with custom field separator', function () {
        var component = new ngx_csv_1.ngxCsv([{ name: 'test', age: 20 }], 'My Report', { useBom: false, quoteStrings: '|', noDownload: true });
        var csv = component['csv'];
        var first_row = csv.split(ngx_csv_1.CsvConfigConsts.EOL)[0].split(',');
        expect(first_row[0]).toMatch('\\|.*\\|');
    });
    it('should return csv file with correct header labels', function () {
        var component = new ngx_csv_1.ngxCsv([{ name: 'test', age: 20 }], 'My Report', {
            useBom: false,
            showLabels: true,
            headers: ["name", "age"],
            noDownload: true
        });
        var csv = component['csv'];
        var labels = csv.split(ngx_csv_1.CsvConfigConsts.EOL)[0].split(',');
        expect(labels[0]).toEqual('name');
        expect(labels[1]).toEqual('age');
    });
    it('should return csv file with empty values', function () {
        var component = new ngx_csv_1.ngxCsv([{ name: 'test', age: null, other: true }], 'My Report', { useBom: false, noDownload: true, removeEmptyValues: true });
        var csv = component['csv'];
        var first_row = csv.split(ngx_csv_1.CsvConfigConsts.EOL)[0];
        expect(first_row).toMatch('"test",,TRUE');
    });
});
//# sourceMappingURL=ngx-csv.spec.js.map