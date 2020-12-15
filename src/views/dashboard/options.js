import echarts from 'echarts'

// 总目标统计
export const targetChart = (params) => {
  const data = params;
  const arrName = getArrayValue(data, "name");
  const arrValue = getArrayValue(data, "value");
  const sumValue = eval(arrValue.join('+'));
  const objData = array2obj(data, "name");
  const optionData = getData(data)
  function getArrayValue (array, key) {
    var key = key || "value";
    var res = [];
    if (array) {
      array.forEach(function (t) {
        res.push(t[key]);
      });
    }
    return res;
  }

  function array2obj (array, key) {
    var resObj = {};
    for (var i = 0; i < array.length; i++) {
      resObj[array[i][key]] = array[i];
    }
    return resObj;
  }

  function getData (data) {
    var res = {
      series: [],
      yAxis: []
    };
    for (let i = 0; i < data.length; i++) {
      // console.log([70 - i * 15 + '%', 67 - i * 15 + '%']);
      res.series.push({
        name: '',
        type: 'pie',
        clockWise: false, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [40 - i * 15 + '%', 45 - i * 15 + '%'],
        center: ["40%", "55%"],
        label: {
          show: false
        },
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false
          },
          borderWidth: 5,
        },
        data: [{
          value: data[i].value,
          name: data[i].name
        }, {
          value: sumValue - data[i].value,
          name: '',
          itemStyle: {
            color: "rgba(0,0,0,0)",
            borderWidth: 0
          },
          tooltip: {
            show: false
          },
          hoverAnimation: false
        }]
      });
      res.series.push({
        name: '',
        type: 'pie',
        silent: true,
        z: 1,
        clockWise: false, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [40 - i * 15 + '%', 45 - i * 15 + '%'],
        center: ["40%", "55%"],
        label: {
          show: false
        },
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false
          },
          borderWidth: 5,
        },
        data: [{
          value: 7.5,
          itemStyle: {
            color: "rgb(3, 31, 62)",
            borderWidth: 0
          },
          tooltip: {
            show: false
          },
          hoverAnimation: false
        }, {
          value: 2.5,
          name: '',
          itemStyle: {
            color: "rgba(0,0,0,0)",
            borderWidth: 0
          },
          tooltip: {
            show: false
          },
          hoverAnimation: false
        }]
      });
      res.yAxis.push(sumValue === 0 ? '0%' : (data[i].value / sumValue * 100).toFixed(2) + "%");
    }
    return res;
  }
  return ({
    legend: {
      show: true,
      icon: "circle",
      top: "center",
      left: '80%',
      data: arrName,
      width: 50,
      padding: [0, 5],
      itemGap: 25,
      formatter: function (name) {
        return "{title|" + name + "}"
      },

      textStyle: {
        rich: {
          title: {
            fontSize: 16,
            lineHeight: 15,
            color: "rgb(0, 178, 246)"
          },
          value: {
            fontSize: 18,
            lineHeight: 20,
            color: "#fff"
          }
        }
      },
    },
    tooltip: {
      show: true,
      trigger: "item",
      formatter: "{a}<br>{b}:{c}({d}%)"
    },
    color: ['rgb(24, 183, 142)', 'rgb(1, 179, 238)', 'rgb(22, 75, 205)', 'rgb(52, 52, 176)'],
    grid: {
      top: '16%',
      bottom: '53%',
      containLabel: false
    },
    yAxis: [{
      type: 'category',
      inverse: true,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
        inside: true,
        textStyle: {
          color: "#000000",
          fontSize: 16,
        },
        show: true
      },
      data: optionData.yAxis
    }],
    xAxis: [{
      show: false
    }],
    series: optionData.series
  }
  )
}
const placeHolderStyle1 = {
  normal: {
    label: {
      show: false
    },
    labelLine: {
      show: false
    },
    color: "rgba(0,0,0,0)",
    borderWidth: 0
  },
  emphasis: {
    color: "rgba(0,0,0,0)",
    borderWidth: 0
  }
};
const dataStyle = {
  normal: {
    formatter: '{c}',
    position: 'center',
    show: true,
    textStyle: {
      fontSize: '40',
      fontWeight: 'normal',
      color: '#34374E'
    }
  }
};
// 测试统计
export const testChart = (params) => ({
  backgroundColor: '#fff',
  title: [{
    text: '作业次数',
    left: '29.8%',
    top: '60%',
    textAlign: 'center',
    textStyle: {
      fontWeight: 'normal',
      fontSize: '16',
      color: '#AAAFC8',
      textAlign: 'center',
    },
  }, {
    text: '考试次数',
    left: '70%',
    top: '60%',
    textAlign: 'center',
    textStyle: {
      color: '#AAAFC8',
      fontWeight: 'normal',
      fontSize: '16',
      textAlign: 'center',
    },
  }],

  //第一个图表
  series: [{
    type: 'pie',
    hoverAnimation: false, //鼠标经过的特效
    radius: ['35%', '40%'],
    center: ['30%', '50%'],
    startAngle: 225,
    labelLine: {
      normal: {
        show: false
      }
    },
    label: {
      normal: {
        position: 'center'
      }
    },
    data: [{
      value: 100,
      itemStyle: {
        normal: {
          color: '#E1E8EE'
        }
      },
    }, {
      value: 35,
      itemStyle: placeHolderStyle1,
    },

    ]
  },
  //上层环形配置
  {
    type: 'pie',
    hoverAnimation: false, //鼠标经过的特效
    radius: ['35%', '40%'],
    center: ['30%', '50%'],
    startAngle: 225,
    labelLine: {
      normal: {
        show: false
      }
    },
    label: {
      normal: {
        position: 'center'
      }
    },
    data: [{
      value: params[1].value,
      itemStyle: {
        normal: {
          color: '#6F78CC'
        }
      },
      label: dataStyle,
    }, {
      value: 35,
      itemStyle: placeHolderStyle1,
    },

    ]
  },


  //第二个图表
  {
    type: 'pie',
    hoverAnimation: false,
    radius: ['35%', '40%'],
    center: ['70%', '50%'],
    startAngle: 225,
    labelLine: {
      normal: {
        show: false
      }
    },
    label: {
      normal: {
        position: 'center'
      }
    },
    data: [{
      value: 100,
      itemStyle: {
        normal: {
          color: '#E1E8EE'


        }
      },

    }, {
      value: 35,
      itemStyle: placeHolderStyle1,
    },

    ]
  },

  //上层环形配置
  {
    type: 'pie',
    hoverAnimation: false,
    radius: ['35%', '40%'],
    center: ['70%', '50%'],
    startAngle: 225,
    labelLine: {
      normal: {
        show: false
      }
    },
    label: {
      normal: {
        position: 'center'
      }
    },
    data: [{
      value: params[0].value,
      itemStyle: {
        normal: {
          color: '#4897f6'
        }
      },
      label: dataStyle,
    }, {
      value: 55,
      itemStyle: placeHolderStyle1,
    },

    ]
  },
  ]
})

// 近期课程
export const examResultChart = (params, total, title) => {
  var color = ['#FC4567', '#2F8DF4', '#C25EC4']
  return ({
    color: color,
    title: {
      text: `共${total}题`,
      subtext: title,
      left: 'center',
      top: '45%',
      textStyle: {
        fontSize: 22,
        color: '#000000',
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 20
    },
    series: [{
      type: 'pie',
      roseType: 'radius',
      radius: ['30%', '60%'],
      data: params,
      label: {
        normal: {
          formatter: '{font|{c}}\n{hr|}\n{font|{d}%}',
          rich: {
            font: {
              fontSize: 20,
              padding: [5, 0],
              color: '#000000'
            },
            hr: {
              height: 0,
              borderWidth: 1,
              width: '100%',
              borderColor: '#000000'
            }
          }
        },
      },
      labelLine: {
        lineStyle: {
          color: '#000000'
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0,0,0,0.5)'
        }
      }
    }]
  })
}

// 课程对比
export const examChart = (params) => {
  let yData = params.map(item => item.name)
  let valueData = params.map(item => item.value)
  return ({
    "title": {
      "text": "",
      x: "center",
      y: "4%",
      textStyle: {
        color: '#000000',
        fontSize: '22'
      },
      subtextStyle: {
        color: '#000000',
        fontSize: '16',

      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '20%',
      right: '0%',
      left: '10%',
      bottom: '20%'
    },
    xAxis: [{
      type: 'category',
      data: yData,
      axisLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.12)'
        }
      },
      axisLabel: {
        margin: 10,
        color: '#000000',
        interval: 0,
        textStyle: {
          fontSize: 14
        },
      },
    }],
    yAxis: [{
      name: '',
      axisLabel: {
        formatter: '{value}',
        color: '#000000',
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: 'rgba(255,255,255,1)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.12)'
        }
      }
    }],
    series: [{
      type: 'bar',
      data: valueData,
      barWidth: '20px',
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(0,244,255,1)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(0,77,167,1)' // 100% 处的颜色
          }], false),
          barBorderRadius: [30, 30, 30, 30],
          shadowColor: 'rgba(0,160,221,1)',
          shadowBlur: 4,
        }
      },
      label: {
        normal: {
          show: true,
          lineHeight: 30,
          width: 80,
          height: 30,
          backgroundColor: 'rgba(0,160,221,0.1)',
          borderRadius: 200,
          position: ['-8', '-60'],
          distance: 1,
          formatter: [
            '    {d|●}',
            ' {c}',
          ].join(','),
          rich: {
            d: {
              color: '#3CDDCF',
            },
            a: {
              color: '#000000',
              align: 'center',
            },
            b: {
              width: 1,
              height: 30,
              borderWidth: 1,
              borderColor: '#234e6c',
              align: 'left'
            },
          }
        }
      }
    }]
  })
}

// 课程对比1
export const examChart1 = (params) => {
  var cost = [0.5, 0.201, 0.6, 0.7, 0.301, 0.8, 0.4]//本期比上期（大于1按1处理）
  var dataCost = [10.01, 200, 200, 1000.01, 200000, 200, 200000]//真是的金额
  var totalCost = [1, 1, 1, 1, 1]//比例综合
  var visits = Object.values(params)//本期占总的百分比*100
  var grade = Object.keys(params)
  var myColor = ['#21BF57', '#56D0E3', '#1089E7', '#F8B448', '#F57474',];
  var data = {
    grade: grade,
    cost: cost,
    totalCost: totalCost,
    visits: visits,
    dataCost: dataCost
  };
  return ({
    title: {
      top: '2%',
      left: 'center',
      text: '',
      textStyle: {
        align: 'center',
        color: '#4DCEF8',
        fontSize: 18
      }
    },
    grid: {
      left: '130',
      right: '100'
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      type: 'category',
      axisLabel: {
        margin: 30,
        show: true,
        color: '#4DCEF8',
        fontSize: 14
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      data: data.grade
    },
    series: [{
      type: 'bar',
      barGap: '-65%',
      label: {
        normal: {
          show: true,
          position: 'right',
          color: '#000000',
          fontSize: 14,
          formatter:
            function (param) {
              return data.visits[param.dataIndex];
            },
        }
      },
      barWidth: '30%',
      itemStyle: {
        normal: {
          borderColor: '#4DCEF8',
          borderWidth: 2,
          barBorderRadius: 15,
          color: 'rgba(102, 102, 102,0)'
        },
      },
      z: 1,
      data: data.totalCost,
      // data: da
    }, {
      type: 'bar',
      barGap: '-85%',
      barWidth: '21%',
      itemStyle: {
        normal: {
          barBorderRadius: 16,
          color: function (params) {
            var num = myColor.length;
            return myColor[params.dataIndex % num]
          },
        }
      },
      max: 1,
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: ''
        }
      },
      labelLine: {
        show: true,
      },
      z: 2,
      data: data.cost,
    }]
  })
}

