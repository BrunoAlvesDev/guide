import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { ChartData } from 'src/app/shared/interfaces/chart-data';
import { StockService } from 'src/app/shared/services/stock.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public loading: boolean = true;
  public error: boolean = false;

  public chartData: ChartData = {
    days: [],
    values: [],
    dayVariation: [],
    totalVariation: [],
  };

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.getStockExchangeDays();
  }

  private getStockExchangeDays(): void {
    let _days: string[] = [];

    let _counter = 0;

    while (_days.length < 30) {
      let _day = new Date();
      _day.setDate(_day.getDate() - _counter);

      if (_day.getDay() !== 0 && _day.getDay() !== 6) {
        _days.push(_day.toLocaleDateString('pt'));
      }

      _counter++;
    }

    this.chartData.days = _days.reverse();

    this.loadStockData();
  }

  private loadStockData(): void {
    this.stockService.getStockData().subscribe((data) => {
      if (data && data.status.http_code === 200) {
        let _data = JSON.parse(data.contents);

        let _values = _data.chart.result[0].indicators.quote[0].open;
        _values = _values.slice(1).slice(-this.chartData.days.length);

        _values = _values.map((value: number) => {
          return Number(value ? value : this.calculateAverage(_values));
        });

        this.chartData.values = _values;

        this.calculateVariation();
      } else {
        this.loading = false;
        this.error = true;
      }
    });
  }

  /* Em um dos testes realizados, um valor de abertura foi retornado como 'null',
  para proteger o código de eventuais falhas no endpoint, desenvolvi essa função
  que calcula o valor médio a fim de manter a dinâmica do desafio e preencher
  essas lacunas*/
  private calculateAverage(array: number[]): number {
    array = array.slice(1).slice(-5);
    let _total = array.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    let _average = _total / 5;
    return _average;
  }

  private calculateVariation(): void {
    let _firstValue = this.chartData.values[0];
    let _lastValue = 0;

    this.chartData.values.forEach((value: number, index) => {
      if (index === 0) {
        _lastValue = value;

        this.chartData.dayVariation.push(0);
        this.chartData.totalVariation.push(0);

        return;
      }

      let _dayVariation = ((value - _lastValue) / _lastValue) * 100;
      _dayVariation = Math.round(_dayVariation * 100) / 100;

      this.chartData.dayVariation.push(_dayVariation);

      let _totalVariation = ((value - _firstValue) / _firstValue) * 100;
      _totalVariation = Math.round(_totalVariation * 100) / 100;

      this.chartData.totalVariation.push(_totalVariation);

      _lastValue = value;
    });

    this.createChart();
  }

  private createChart(): void {
    let _maxValue = Math.max(...this.chartData.totalVariation);
    let _minValue = Math.min(...this.chartData.totalVariation);

    let _maxDayVariation = Math.max(...this.chartData.dayVariation);
    let _minDayVariation = Math.min(...this.chartData.dayVariation);

    if (_maxDayVariation > _maxValue) _maxValue = _maxDayVariation;
    if (_minDayVariation < _minValue) _minValue = _minDayVariation;

    let _options = {
      colors: ['#133A3B', '#068E87'],
      series: [
        {
          name: 'Variação ao dia anterior',
          data: this.chartData.dayVariation,
        },
        {
          name: 'Variação desde o início',
          data: this.chartData.totalVariation,
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      yaxis: {
        tickAmount: 4,
        min: _minValue,
        max: _maxValue,
        labels: {
          formatter: (value: number) => {
            return `${value.toFixed(2)}%`;
          },
        },
      },
      xaxis: {
        categories: this.chartData.days,
      },
    };

    let _chart = new ApexCharts(document.querySelector('#chart'), _options);
    _chart.render();
    this.loading = false;
  }
}
