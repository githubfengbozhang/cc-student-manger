import echarts from 'echarts'
const getData = (target) => {
  let list = [];
  ['能力', '素质', '知识'].map(itemName => {
    // 当前目标集合
    let targetList = target.filter(item => item.title === itemName)
    // 当前目标集合对错总数
    const targetTotol = targetList.map(item => item.num).reduce((total, num) => {
      return total + num;
    })
    // 添加当前目标新属性
    targetList = targetList.map(item => {
      item.targetTotol = targetTotol
      const tempObject = {
        value: targetTotol,
        num: item.num,
        name: itemName,
        flag: item.flag
      }
      return tempObject;
    })
    // 获取答题正确的目标
    const tempList = targetList.filter(item => item.flag * 1 === 0)
    // push到新集合对象中
    list = [...list, ...tempList]
  })
  return list
}
export const taskChart = (target) => ({
  title: {
    text: '各科目标分析对比',
    subtext: '目标答对率',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    // formatter: '{a} <br/>{b} : {c} ({d}%)'
    formatter: function (dataSource) {
      const { data: {
        flag,
        name,
        num,
        value
      }, seriesName } = dataSource
      return `${name}(${value})<br/>${seriesName}: (${((num / value).toFixed(2)) * 100}%)`
    }
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['能力', '素质', '知识']
  },
  series: [
    {
      name: '答对率',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      hoverAnimation: false,
      data: getData(target),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
)

export const contrastChart = (target) => {
  // 过滤目标正确数据
  const targetList = target.filter(item => item.flag * 1 === 0)
  // 获取目标name集合
  const nameList = targetList.map(item => item.title)
  // 获取目标num集合
  const numList = targetList.map(item => item.num)
  return ({
    title: {
      text: '目标答题正确数',
      textStyle: {
        fontSize: 12,
        fontWeight: 400
      },
      left: 'center',
      top: '5%'
    },
    backgroundColor: '#fff',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.5)',
      axisPointer: {
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'red'
            }, {
              offset: 0.5,
              color: '#48b3FF',
            }, {
              offset: 1,
              color: '#d9efff'
            }],
            global: false
          }
        },
      },
    },
    grid: {
      top: '5%',
      left: '5%',
      right: '3%',
      bottom: '8%',
      // containLabel: true
    },
    xAxis: [{
      type: 'category',
      color: '#59588D',
      axisLine: {
        show: true
      },
      axisLabel: {
        color: '#282828'
      },
      splitLine: {
        // show: true
      },

      axisTick: {
        show: false
      },
      // boundaryGap: true,
      data: nameList,

    }],

    yAxis: [{
      type: 'value',
      min: 0,
      splitNumber: 4,
      splitLine: {
        show: true,

      },
      axisLine: {
        show: true,
      },
      axisLabel: {
        show: true,
        // margin: 20,
        textStyle: {
          color: '#737373',

        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(131,101,101,0.2)',
          type: 'dashed',
        }
      }
    }],
    series: [{
      name: '',
      type: 'line',
      // smooth: true, //是否平滑
      showAllSymbol: true,
      symbol: 'circle',
      symbolSize: 10,
      lineStyle: {
        normal: {
          color: "#48B3FF"
        },
      },
      label: {
        show: false,
        position: 'top',
        textStyle: {
          color: '#48B3FF',
        }
      },

      itemStyle: {
        color: "#FFF",
        borderColor: "#48B3FF",
        borderWidth: 2,

      },
      tooltip: {
        show: true
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(195,230,255,1)'
          },
          {
            offset: 1,
            color: 'rgba(195,230,255,0.1)'
          }
          ], false),
          shadowColor: 'rgba(195,230,255,0.1)',
          shadowBlur: 20
        }
      },
      data: numList,
    }]
  })
}