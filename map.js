$(function () {
    let container = document.getElementById("container"),
        map,
        flag = 0,
        click = 1,
        startPID = "",
        endPID = "",
        startPlace="",
        endPlace="";

    GIM.REMOTE_SERVER = "https://ifs.cloudindoormap.com/webAPI/ClientService.asmx/Command?callback&";

    // 地图初始化函数
    function initMap() {
        var params = {
            initCompleted: initCompleted, //初始化完成之后的调用函数
            onSelected: onSelected, //当区块被选中时触发的方法
            enabledControl: true, //是否启用手势操作
            container: container, //包装的div
            themeID: "1003", //主题文件夹编号
            backgroundColor: 0x333333, //地图背景颜色
            compassOffset: [88, 10, 0, 40], //指南针的位置和角度
            showLabelType: "No.", //默认显示店铺号，可以选
            crossBuild: false, //是否跨建筑
            labelScale: 1.5, //文本缩放值
            initFloorID: "EB72B381-B3BC-40A4-B8DF-3D932302B9D8", //初始化显示的楼层 可选
            projectID: "261FDAD7-33F9-40A4-BD33-25F1C884F54C",//csifs
            cloudID: "EFDBF244-D179-43F6-9522-A430CCFAD9D3", //云ID
            preCreation: false, //是否后台静默渲染 默认为true
            logoFiled: "Logo", //调用接口哪个字段的图片
            opacity: 1, //块的透明度
            accessToken: "BAF3CB32-E8F2-40A6-AE1A-A5BFE2CB6E14",//腾讯分层测试
        };

        map = new GIM.Map3D(params); // 初始化地图
        map.defaultCenterPoint = { x: 2500, y: -2500 };
    }

    // 初始化地图
    initMap();



    // 设置地图大小
    map.setSize(window.innerWidth, window.innerHeight);
    // 地图旋转角度
    map.setAzimuthalAngle(45);

    // 地图缩放级别
    map.zoomLevel(20);

    map.showCompass(true);

    // 地图初始化之后的回调函数
    function initCompleted(data) {

        // 遍历动态渲染li
        data.forEach(element => {
            $(".floorContainer .floorToggleUl").append(
                `<li class="btn" data="${element.floorID}" value="${element.Name}" id="${element.Name}">${element.Name}</li>`
            );
        });

        console.log(data)
        // 默认第一个加btn_active类
        $(".btn")
            .eq(0)
            .addClass("btn_active");

        // btn_show点击事件

        $(".btn_show").on("click", function () {

        })

        // btn点击事件
        $(".floorToggleUl .btn").on("click", function () {

            // 点击实现切换折叠按钮
            if (flag == 0) {
                $(".floorContainer").removeClass(
                    "floorToggleUl_close"
                );
                $(".floorContainer").addClass(
                    "floorToggleUl_open"
                );
                flag = 1;
            } else {
                $(".floorContainer").removeClass(
                    "floorToggleUl_open"
                );
                $(".floorContainer").addClass(
                    "floorToggleUl_close"
                );
                let btnNum = $(this).index(),
                    floorid = [],
                    floorName;

                // 点击相应按钮将其楼层id放入数组中
                floorid.push(data[btnNum].FloorID);

                // 楼层切换函数
                map.showFloors(floorid, true);

                // 点击按钮显示当前楼层按钮
                $(".btn")
                    .eq(btnNum)
                    .addClass("btn_active")
                    .siblings()
                    .removeClass("btn_active");

                floorName = data[btnNum].Name;
                $(".btn_show").html(floorName);
                flag = 0;
            }


        }
        );
    }

    // 当前区块点击触发事件回调函数 
    function onSelected(e) {
        console.log(e);

        // 自动寻路模块
        if (click == 1) {
            // 显示起点终点设置区块
            $(".setStart").show(500);

            // 设置起点函数
            setStart = function () {
                // 设置起点nodeId
                map.startPID = e.nodeId;
                startPID = e.nodeId;
                $(".setStart").hide(500);

                // 起点终点显示部分
                $(".showStartEnd").slideDown(500);
                startPlace=e.name;
                console.log(startPlace)
                $(".startPlace").html(startPlace)
            };
            // 起点取消按钮事件
            cancelStart = function () {
                $(".setStart").hide(500);
            };
            click++;
        } else {
            $(".setEnd").show(500);

            // 设置终点函数
            setEnd = function () {
                // 设置终点nodeId
                map.endPID = e.nodeId;
                endPID = e.nodeId;
                $(".setEnd").hide(500);
                if (startPID & endPID) {
                    if (startPID == endPID) {
                        alert("起点终点相同，请重新设置");
                    }
                    endPlace=e.name;
                    console.log(endPlace)
                    $(".endPlace").html(endPlace)
                    map.searchPath(function (msg) {
                        if (msg.type == 'done') {
                            // 地图缩放比
                            map.zoomLevel(12);
                            // 设置地图仰角
                            map.setPolarAngle(40);
                            //  显示取消寻路按钮
                            $(".cancelSearch").show(500);
                            // 取消寻路按钮事件
                            cancelSearch = function () {
                                map.clearPath(true);
                                map.zoomLevel(20);
                                map.setPolarAngle(0);
                                $(".cancelSearch").hide(500);
                                // 起点终点显示模块隐藏
                                $(".showStartEnd").slideUp(500);
                            }
                        } else {
                            alert('寻路失败');
                        }
                    })
                }
            };

            // 起点取消按钮事件
            cancelEnd = function () {
                $(".setEnd").hide(500);
            };
            click--;
        }
    }
});