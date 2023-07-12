// 柱状图
import { Component } from "react";
import { View } from "@tarojs/components";
import { getCurrentInstance } from "@tarojs/taro" //Taro3.x需要使用getCurrentInstance 获取页面DOM
import * as echarts from "./ec-canvas/echarts";

function setChartData (chart) {
  const defautOption = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(220, 220, 220, 0.8)",
        },
      },
    ],
  };
  chart.setOption(defautOption);
}

export default class BarChart extends Component {
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