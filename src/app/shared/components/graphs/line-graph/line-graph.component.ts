import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartTypeRegistry,
  registerables,
} from 'chart.js';
import { GraphOptions } from 'src/app/shared/models/graphs/graph-options';

Chart.register(...registerables);

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrl: './line-graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineGraphComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas', { static: true }) canvas?: ElementRef;
  @Input({ required: true }) chartOptions!: GraphOptions;
  @Input() canvasHeight?: string;
  private chartObj?: Chart;

  ngAfterViewInit(): void {
    if (!this.canvas) {
      console.error(
        'An attempt to render chart was made while the canvas was still being initialized. Failed to render chart.'
      );
      return;
    }
    const buildOptions: ChartConfiguration<
      keyof ChartTypeRegistry,
      number[],
      string
    > = {
      type: 'line',
      data: {
        labels: this.chartOptions.labels,
        datasets: this.chartOptions.datasets,
      },
      options: {
        elements: {
          line: {
            tension: 0.2,
          },
        },
        plugins: {
          title: this.chartOptions.title
            ? {
                display: true,
                text: this.chartOptions.title,
                position: 'top',
                align: 'start',
                padding: {
                  top: 10,
                  bottom: 30,
                },
                font: {
                  size: 16,
                },
              }
            : undefined,
          legend:
            this.chartOptions.legend !== 'none'
              ? {
                  display: true,
                  position: this.chartOptions.legend,
                }
              : undefined,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
    if (this.chartOptions.xScale || this.chartOptions.yScale) {
      if (!buildOptions.options!.scales) {
        buildOptions.options!.scales = {};
      }
      if (this.chartOptions.xScale) {
        buildOptions.options!.scales!['x'] = this.chartOptions.xScale;
      }
      if (this.chartOptions.yScale) {
        buildOptions.options!.scales!['y'] = this.chartOptions.yScale;
      }
    }
    this.chartObj = new Chart(this.canvas?.nativeElement, buildOptions);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chartObj) {
      this.chartObj.data.labels = changes['chartOptions'].currentValue.labels;
      this.chartObj.data.datasets =
        changes['chartOptions'].currentValue.datasets;
      const chartPlugins = this.chartObj.options.plugins;
      if (chartPlugins) {
        const chartTitle = chartPlugins.title;
        if (chartTitle) {
          chartTitle.display =
            changes['chartOptions']?.currentValue.title !== undefined;
          chartTitle.text = changes['chartOptions']?.currentValue.title;
          this.chartObj.options.plugins!.title = chartTitle;
        }
      }
      this.chartObj.update();
    }
  }
}
