let list = [{
    name: "新闻",
    value: "66"
}, {
    name: "微博",
    value: "90"
}, {
    name: "__other",
    value: "0"
}]

let sum = 0;
list.map((item, index) => {
    sum += parseInt(item.value)
})

list[list.length - 1].value = sum
let colorList = ['#33ccff', '#3399ff', "rgba(0,0,0,0)"]

option = {
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
    }],
    tooltip: {},
 legend: {
    icon: "circle",
    orient: 'horizontal',
    // x: 'left',
    data:['新闻','微博'],
    right: 340,
    bottom: 150,
    align: 'right',
    textStyle: {
      color: "#fff"
    },
    itemGap: 20
},
    color: colorList,
    series: [{
        name: "",
        type: "pie",
        hoverAnimation: false,
        startAngle: -180,
        radius: ["60%", "100%"],
        center: ["50%", "70%"],
        label: {
            normal: {
                show: true,
                position: "inner", //显示在扇形上
                formatter: "{b}", //显示内容
                textStyle: {
                    color: "white", // 改变标示文字的颜色
                    fontSize: 12, //文字大小
                    fontWeight: "bold",
                },
            },
        },
        labelLine: {
            normal: {
                show: false,
            },
        },
        data: list,
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
            },
        },
    }, ],
}