"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
const jspdf_1 = require("jspdf");
const jspdf_autotable_1 = require("jspdf-autotable");
function checkIfArrayContainsObjects({ data, }) {
    if (Array.isArray(data)) {
        if (typeof data[0] === 'object') {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
}
function checkIfArrayLengthIsOne({ data }) {
    return Array.isArray(data) && data.length === 1;
}
function buildHeader({ data }) {
    const columnSet = new Set();
    if (!checkIfArrayContainsObjects({ data })) {
        return [];
    }
    data.forEach((column) => {
        Object.keys(column).forEach((key) => columnSet.add(key));
    });
    return Array.from(columnSet);
}
function getSimplifiedRow({ row }) {
    let stringifiedRow;
    if (typeof row == 'object') {
        if (!checkIfArrayContainsObjects({ data: row })) {
            stringifiedRow = row.toString();
        }
        else {
            stringifiedRow = JSON.stringify(checkIfArrayLengthIsOne({ data: row }) ? row[0] : row);
        }
    }
    else {
        stringifiedRow = row;
    }
    return stringifiedRow ? stringifiedRow : '';
}
function buildBody({ data }) {
    const res = [];
    let row = [];
    const table_columns = buildHeader({ data });
    const isArrayOfObjects = checkIfArrayContainsObjects({ data });
    if (isArrayOfObjects) {
        data.forEach((header) => {
            table_columns.forEach((col) => {
                row.push(getSimplifiedRow({ row: header[col] }));
            });
            res.push(row);
            row = [];
        });
    }
    else {
        row = data.map((d) => [d]);
        res.push(row);
    }
    return res;
}
function getOverallDetailsTableBody({ data }) {
    const rows = [];
    for (const key in data) {
        if (typeof data[key] !== 'object') {
            rows.push([key, data[key]]);
        }
    }
    return rows;
}
function getTableHeaders({ data }) {
    const rows = [];
    for (const key in data) {
        if (typeof data[key] === 'object') {
            rows.push(key);
        }
    }
    return rows;
}
function generatePdf({ data, pdfHeading = 'Report', }) {
    const doc = new jspdf_1.jsPDF({ orientation: 'landscape' });
    (0, jspdf_autotable_1.default)(doc, {
        head: [
            [{ content: pdfHeading.toUpperCase(), styles: { fillColor: 'green' } }],
        ],
    });
    (0, jspdf_autotable_1.default)(doc, {
        body: getOverallDetailsTableBody({ data }),
    });
    const headers = getTableHeaders({ data });
    for (const element of headers) {
        const styles = {
            overflow: 'linebreak',
            cellPadding: 1,
            fontSize: 5,
        };
        const columnStyles = {};
        const table_headers = buildHeader({ data: data[element] });
        if (table_headers.length < 10) {
            styles.fontSize = 6;
            styles.cellWidth = 'wrap';
        }
        else {
            for (let i = 0; i < 10; i++) {
                columnStyles[i] = { cellWidth: 20 };
            }
        }
        (0, jspdf_autotable_1.default)(doc, {
            head: [
                [
                    {
                        content: element.toUpperCase(),
                        styles: { fillColor: 'green' },
                    },
                ],
            ],
        });
        (0, jspdf_autotable_1.default)(doc, {
            head: table_headers.length > 0 ? [table_headers] : undefined,
            body: buildBody({ data: data[element] }),
            styles,
            columnStyles: columnStyles
                ? columnStyles
                : { text: { cellWidth: 'auto' } },
        });
    }
    return doc.output();
}
exports.generatePdf = generatePdf;
