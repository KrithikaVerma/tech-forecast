import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-comparison-cmp',
  moduleId: module.id,
  templateUrl: 'comparison.component.html'
})

export class ComparisonComponent implements OnInit {

  public canvas: any;
  public ctx;
  public chartColor;
  public chartComparison;
  public chartHours;
  public chartReputationA;
  categories: any;
  selected: any;
  private labels: string[];
  private responseData: String;
  private data2020: {};

  private sidebarVisible: boolean;

  constructor(
    private http: HttpClient
  ) {
  }

  getSelectedValue() {
    const tags = []
    this.selected.forEach(val => {
      tags.push(val.name);
    })

    console.log(this.selected);
    const response = this.http.get<string>(`http://localhost:5000/comparison?name=` + tags );
    //console.log(response)
//////////////////// Vaish trial

    response.toPromise().then(value => {
      
      this.responseData = value
      this.labels = Object.keys(this.responseData)
      const data = [];

      const currentYear = 2020;

      let dateLabel = []
      this.labels.forEach(label => {
        var a = (new Date(+label))
        var b = a.getFullYear()
        //console.log("b    ", b)
        if (b === currentYear){
          dateLabel.push(label)
        }
        
      });
      console.log("datELABEL ", dateLabel)
      
      this.data2020 = {}
      tags.forEach(tag => {
        this.data2020[tag] = 0
      })

      dateLabel.forEach(key =>{
        tags.forEach(tag => {
          this.data2020[tag] = this.data2020[tag] + this.responseData[key][tag]
        })
      })
      console.log("data2020  " , this.data2020)
      
      var li = []
      for (const i of Object.keys(this.data2020)){
        li.push(this.data2020[i])
      }
      console.log("listttttttt", li)
      
//// Create chart code :
      this.chartColor = '#FFFFFF';
      this.ctx = document.getElementById('chartComparison');
      //this.ctx = this.canvas.getContext('2d');
      this.chartComparison = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(this.data2020),                       //Object.keys(value[currentYear]),
          datasets: [{
            label: 'Comparative Analysis',
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: [
              dynamicColors(),
              dynamicColors(),
              dynamicColors(),
              dynamicColors()
            ],
            borderWidth: 0,
            data: li
          }]
        },

        options: {

          legend: {
            display: true,
            position: 'bottom'
          },

          pieceLabel: {
            render: 'percentage',
            fontColor: ['white'],
            precision: 2
          },

          tooltips: {
            enabled: false
          },

          scales: {
            yAxes: [{

              ticks: {
                display: false
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: 'transparent',
                color: 'rgba(255,255,255,0.05)'
              }

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: 'transparent'
              },
              ticks: {
                display: false,
              }
            }]
          },
        }
      });
    });
  }

  ngOnInit() {
    const response = this.http.get<string[]>(`http://localhost:5000/tags`);
    response.toPromise().then(value => {
      console.log(value)
      this.categories = []
      value.forEach(value1 => {
        const abc: any = {
          name: value1,
          disabled: false,
        };
        this.categories.push(abc)
      })
    })
  }
}

function dynamicColors() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
