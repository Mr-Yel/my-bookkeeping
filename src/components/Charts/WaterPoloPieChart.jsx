import { Component } from "react";
import { getCurrentInstance } from "@tarojs/taro" //Taro3.x需要使用getCurrentInstance 获取页面DOM
import * as echarts from "./ec-canvas/echarts";

function setChartData(chart, data) {
  let option = {
    //标题
    title: {
      text: 1 + "%", //主标题文本
      left: "center",
      top: "center",
      textStyle: {
        fontSize: 18,
        color: '#333',
        align: "center",
      },
    },
    series : [
      {
        name: '预算',
        type: 'pie',
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        center: ['50%', '50%'],
        radius: ["60%", "80%"],
        itemStyle: {
          borderRadius: 40,
          // borderWidth: 2,
        },
        data:[
          {
            value: 12,
            itemStyle: {
              normal: {
                color: '#333',
              },
            },
          },
          {
            value: 100 - 12,
            itemStyle: {
              normal: {
                color: 'red',
              },
            },
          },
        ],
      }
    ]
  };
  chart.setOption(option);
}

export default class WaterPoloPieChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ec: {
        lazyLoad: true
      }
    }
  }
  componentDidMount () {
  }

  refresh (data) {
    console.log(getCurrentInstance());
    getCurrentInstance().page.selectComponent('#mychart-area').init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setChartData(chart, data);
      return chart;
    });
  }
  
  refChart = node => (this.Chart = node);

  render () {
    return (
      <ec-canvas
        id='mychart-area'
        canvasId='mychart-area'
        ec={this.state.ec}
      />
    );
  }
}