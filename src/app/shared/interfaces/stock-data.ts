export interface StockData {
  contents?: Contents | string;
  status?: Status;
}

interface Contents {
  chart?: Chart;
}

interface Chart {
  result?: Result[];
}

interface Result {
  indicators?: Indicators;
}

interface Indicators {
  quote?: Quote[];
}

interface Quote {
  open?: number[];
}

interface Status {
  http_code?: string;
}
