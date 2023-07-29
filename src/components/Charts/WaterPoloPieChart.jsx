import { Component } from "react";
import { getCurrentInstance } from "@tarojs/taro" //Taro3.x需要使用getCurrentInstance 获取页面DOM
import * as echarts from "./ec-canvas/echarts";
import { unifyNumber } from "../../utils"

function setChartData (chart, all = 0, use = 0) {

  let proportion = all ? unifyNumber(use/all*100) + '%' : use ? '100%' : '0%'

  let option = {
    //标题
    title: {
      top: "43%",
      left: "center",
      text: proportion,
      textStyle: {
        color: "#000",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 24,
      }
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "60%"],
        hoverAnimation: false, ////设置饼图默认的展开样式
        labelLine: {
          normal: {
            show: false,
          },
        },
        itemStyle: {
          // 此配置
          normal: {
            borderWidth: 2,
            borderColor: "#fff",
          },
          emphasis: {
            borderWidth: 0,
            shadowBlur: 2,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        data: [{
          name: '',
          value: use,
          labelLine: {
            show: false,
          },
          itemStyle: {
            color: '#5886f0',
          },
          emphasis: {
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: '#5886f0',
            },
          },
        },
        {
          //画剩余的刻度圆环
          name: '',
          value: all-use < 0 ? 0 : use ? all-use : 1,
          itemStyle: {
            color: 'rgba(255,255,255,0)',
          },
          labelLine: {
            show: false,
          },
          label: {
            show: false,
          },
          emphasis: {
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: 'rgba(255,255,255,0)',
            },
          },
        },
        ]
      },
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

  refresh (property, outTotal) {
    console.log(getCurrentInstance());
    getCurrentInstance().page.selectComponent('#mychart-area').init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setChartData(chart, property, outTotal);
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