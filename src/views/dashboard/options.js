
// 总目标统计
export const targetChart = (params) => {
    const placeHolderStyle = {
        normal: {
            label: {
                show: false,
                position: "center"
            },
            labelLine: {
                show: false
            },
            color: "#dedede",
            borderColor: "#dedede",
            borderWidth: 0
        },
        emphasis: {
            color: "#dedede",
            borderColor: "#dedede",
            borderWidth: 0
        }
    };
    return(
        {
            backgroundColor: '#fff',
            color: ['#fc7a26', '#fff', '#ffa127', '#fff', "#ffcd26"],
            legend: [{
                orient: '',
                icon: 'circle',
                left: 'right',
                top: 'center',
                data: ['不喜欢', '喜欢', '跳过']
            }],
            series: [{
                name: '值',
                type: 'pie',
                clockWise: true, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [199, 200],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'outside'
                        },
                        labelLine: {
                            show: true,
                            length: 100,
                            smooth: 0.5
                        },
                        borderWidth: 5,
                        shadowBlur: 40,
                        borderColor: "#fc7a26",
                        shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                    }
                },
                data: [{
                    value: 7,
                    name: '70%'
                }, {
                    value: 3,
                    name: '',
                    itemStyle: placeHolderStyle
                }]
            }, {
                name: '白',
                type: 'pie',
                clockWise: false,
                radius: [180, 180],
                hoverAnimation: false,
                data: [{
                    value: 1
                }]
            }, {
                name: '值',
                type: 'pie',
                clockWise: true,
                hoverAnimation: false,
                radius: [159, 160],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true,
                            length: 100,
                            smooth: 0.5
                        },
                        borderWidth: 5,
                        shadowBlur: 40,
                        borderColor: "#ffa127",
                        shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                    }
                },
                data: [{
                    value: 6,
                    name: '60%'
                }, {
                    value: 4,
                    name: '',
                    itemStyle: placeHolderStyle
                }]
            }, {
                name: '白',
                type: 'pie',
                clockWise: false,
                hoverAnimation: false,
                radius: [140, 140],
                data: [{
                    value: 1
                }]
            }, {
                name: '值',
                type: 'pie',
                clockWise: true,
                hoverAnimation: false,
                radius: [119, 120],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true,
                            length: 100,
                            smooth: 0.5
                        },
                        borderWidth: 5,
                        shadowBlur: 40,
                        borderColor: "#ffcd26",
                        shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                    }
                },
                data: [{
                    value: 4,
                    name: '40%'
                }, {
                    value: 6,
                    name: '',
                    itemStyle: placeHolderStyle
                }]
            }, {
                type: 'pie',
                color: ['#fc7a26', '#ffa127', "#ffcd26"],
                data: [{
                    value: '',
                    name: '不喜欢'
                }, {
                    value: '',
                    name: '喜欢'
                }, {
                    value: '',
                    name: '跳过'
                }]
            }, {
                name: '白',
                type: 'pie',
                clockWise: true,
                hoverAnimation: false,
                radius: [100, 100],
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 1,
                    label: {
                        normal: {
                            formatter: '投票人数',
                            textStyle: {
                                color: '#666666',
                                fontSize: 26
                            }
                        }
                    }
                }, {
                    tooltip: {
                        show: false
                    },
                    label: {
                        normal: {
                            formatter: '\n1200',
                            textStyle: {
                                color: '#666666',
                                fontSize: 26
                            }
                        }
                    }
                }]
            }]
        }
    )
}

// 测试统计
export const  testChart = (params) => {
    const placeHolderStyle = {
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
    return ({
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
                radius: ['25%', '30%'],
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
                        itemStyle: placeHolderStyle,
                    },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false, //鼠标经过的特效
                radius: ['25%', '30%'],
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
                        value: 75,
                        itemStyle: {
                            normal: {
                                color: '#6F78CC'
                            }
                        },
                        label: dataStyle,
                    }, {
                        value: 35,
                        itemStyle: placeHolderStyle,
                    },

                ]
            },


            //第二个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['25%', '30%'],
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
                        itemStyle: placeHolderStyle,
                    },

                ]
            },

            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['25%', '30%'],
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
                        value: 30,
                        itemStyle: {
                            normal: {
                                color: '#4897f6'
                            }
                        },
                        label: dataStyle,
                    }, {
                        value: 55,
                        itemStyle: placeHolderStyle,
                    },

                ]
            },
        ]
    })
}