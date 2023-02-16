import { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

function checkIfArrayContainsObjects({
  data,
}: {
  data: Array<object>;
}): boolean {
  if (Array.isArray(data)) {
    if (typeof data[0] === 'object') {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

function checkIfArrayLengthIsOne({ data }: { data: object }): boolean {
  return Array.isArray(data) && data.length === 1;
}

function buildHeader({ data }: { data: Array<object> }): string[] {
  const columnSet = new Set<string>();
  if (!checkIfArrayContainsObjects({ data })) {
    return [];
  }
  data.forEach((column) => {
    //set column type to avoid type errors
    Object.keys(column).forEach((key: string) => columnSet.add(key));
  });
  return Array.from(columnSet);
}

function getSimplifiedRow({ row }: { row: object[] }): unknown {
  let stringifiedRow;
  if (typeof row == 'object') {
    if (!checkIfArrayContainsObjects({ data: row })) {
      //if array has only strings then we will show a string
      stringifiedRow = row.toString();
    } else {
      stringifiedRow = JSON.stringify(
        checkIfArrayLengthIsOne({ data: row }) ? row[0] : row
      );
    }
  } else {
    stringifiedRow = row;
  }
  return stringifiedRow ? stringifiedRow : '';
}

function buildBody({ data }: { data: Array<object> }): string[][] {
  const res = [];
  let row: Array<unknown> = [];
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
  } else {
    //if body has only one string in one row
    row = data.map((d) => [d]);
    res.push(row);
  }
  return res;
}

function getOverallDetailsTableBody({ data }: { data: object }): RowInput[] {
  const rows = [];
  for (const key in data) {
    if (typeof data[key] !== 'object') {
      rows.push([key, data[key]]);
    }
  }
  return rows;
}

function getTableHeaders({ data }: { data: object }): string[] {
  const rows = [];
  for (const key in data) {
    if (typeof data[key] === 'object') {
      rows.push(key);
    }
  }
  return rows;
}

export function generatePdf({
  data,
  pdfHeading = 'Report',
}: {
  data: object;
  pdfHeading?: string;
}): string {
  const doc = new jsPDF({ orientation: 'landscape' });
  autoTable(doc, {
    head: [
      [{ content: pdfHeading.toUpperCase(), styles: { fillColor: 'green' } }],
    ],
  });
  autoTable(doc, {
    body: getOverallDetailsTableBody({ data }),
  });
  const headers = getTableHeaders({ data });
  for (const element of headers) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const styles: any = {
      overflow: 'linebreak',
      cellPadding: 1,
      fontSize: 5,
    };
    const columnStyles = {};
    const table_headers = buildHeader({ data: data[element] });
    if (table_headers.length < 10) {
      styles.fontSize = 6;
      styles.cellWidth = 'wrap';
    } else {
      for (let i = 0; i < 10; i++) {
        columnStyles[i] = { cellWidth: 20 };
      }
    }
    autoTable(doc, {
      head: [
        [
          {
            content: element.toUpperCase(),
            styles: { fillColor: 'green' },
          },
        ],
      ],
    });
    autoTable(doc, {
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
