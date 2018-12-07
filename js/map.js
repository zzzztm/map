$(function () {
    let container = document.getElementById("container"),
        map,
        flag = 0,
        click = 1,
        p = 1,
        startPID = "",
        endPID = "",
        startPlace = "",
        endPlace = "",
        testSearch = [{
            "name": "L360",
            "bindShopId": "3BCE77DD-CEA8-4687-B9FD-3BAC1D4F81D4",
            "floor": "L3"
        }, {
            "name": "L255",
            "bindShopId": "F35E8698-1FF2-4DBF-908B-BDA11B31ACC9",
            "floor": "L2"
        }, {
            "name": "阿迪达斯",
            "bindShopId": "2D923119-AE74-48AA-AE33-34CA22577C7F",
            "floor": "L2"
        }, {
            "name": "阿迪王",
            "bindShopId": "B6C91844-BF8D-4B10-BEED-1DDB30906CCB",
            "floor": "L3"
        }],
        defaultFloor;

    GIM.REMOTE_SERVER =
        "https://ifs.cloudindoormap.com/webAPI/ClientService.asmx/Command?callback&";

    /**
     * @description 地图初始化函数
     *
     */
    function initMap() {
    var params = {
            initCompleted: initCompleted, //初始化完成之后的调用函数
            onSelected: onSelected, //当区块被选中时触发的方法
            enabledControl: true, //是否启用手势操作
            container: container, //包装的div
            themeID: "1003", //主题文件夹编号
            backgroundColor: 0xdfdfdf, //地图背景颜色
            compassOffset: [88, 10, 0, 40], //指南针的位置和角度
            showLabelType: "No.", //默认显示店铺号，可以选
            crossBuild: false, //是否跨建筑
            labelScale: 1.5, //文本缩放值
            initFloorID: "EB72B381-B3BC-40A4-B8DF-3D932302B9D8", //初始化显示的楼层 可选
            projectID: "261FDAD7-33F9-40A4-BD33-25F1C884F54C", //csifs
            cloudID: "EFDBF244-D179-43F6-9522-A430CCFAD9D3", //云ID
            preCreation: false, //是否后台静默渲染 默认为true
            logoFiled: "Logo", //调用接口哪个字段的图片
            opacity: 1, //块的透明度
            accessToken: "BAF3CB32-E8F2-40A6-AE1A-A5BFE2CB6E14" //腾讯分层测试
        };

        map = new GIM.Map3D(params); // 初始化地图
        map.defaultCenterPoint = {
            x: 2500,
            y: -2500
        };

    }

    // 初始化地图
    initMap();

    // 设置地图大小
    map.setSize(window.innerWidth, window.innerHeight);
    // 地图旋转角度
    map.setAzimuthalAngle(45);

    // 地图缩放级别
    map.zoomLevel(20);

    // 是否展示指南针
    map.showCompass(true);

    /**
     * @description 地图初始化之后的回调函数
     * @param {*} data
     */
    function initCompleted(data) {


        // 遍历动态渲染li
        data.forEach(element => {
            $(".floorContainer .floorToggleUl").append(
                `<li class="btn" data="${element.FloorID}" value="${
                element.Name
                }" id="${element.Name}">${element.Name}</li>`
            );
        });


        // 默认第一个加btn_active类
        $(".btn")
            .eq(8)
            .addClass("btn_active");

        // $(".btn_show").html(floorName);
        $(".floorContainer").hide();
        $(".btn_show").show();

        // btn_show点击事件

        $(".btn_show").on("click", function () {
            $(".btn_show").hide();
            $(".floorContainer").show();
            $(".floorContainer").animate({
                height: '17.5rem'
            }, 200, () => {
                $(".floorContainer").css('overflow', 'scroll');
            })
            flag++;
        });

        /**
         * @description btn点击事件
         */
        $(".floorToggleUl .btn").on("click", function () {

            let btnNum = $(this).index(),
                floorid = [],
                floorName;

            // 点击实现切换折叠按钮
            if (flag == 0) {

                // // 用动画来实现渐变
                // // floorContainer上升
                // $(".floorContainer").animate({
                //     height: '17.5rem'
                // }, 200, () => {
                //     $(".floorContainer").css('overflow', 'scroll');
                // })

                // flag++;
            } else {



                // 点击当前按钮让当前楼层按钮加上btn_active样式
                $(".btn")
                    .eq(btnNum)
                    .addClass("btn_active")
                    .siblings()
                    .removeClass("btn_active");

                floorName = data[btnNum].Name;
                $(".btn_show").html(floorName);


                // 点击相应按钮将其楼层id放入数组中
                floorid.push(data[btnNum].FloorID);

                // floorContainer下降
                $(".floorContainer").animate({
                    height: '3.5rem'
                }, 200, () => {

                    $(".floorContainer").hide();
                    $(".btn_show").show();
                    // 楼层切换函数
                    map.showFloors(floorid, true);
                })
                flag--;

            }
        });
    }
    /**
     * @description 当前区块点击触发事件回调函数
     * @param {*} e
     */
    function onSelected(e) {
        console.log(e);

        $(".search input").val(e.name);
        $(".search .icon-sousuo").hide();
        $(".search span").show();


        // 自动寻路模块
        if (click == 1) {

            // 每次点击之前初始化
            $(".startPlace").html("");
            $(".endPlace").html("");
            map.clearPath(true);

            // 显示起点终点设置区块
            $(".setStart").show(300);

            // 设置起点函数
            setStart = function () {
                // 设置起点nodeId
                startPID = e.nodeId;
                map.startPID = e.nodeId;
                console.log("startPID :", startPID);
                $(".setStart").hide(300);

                // 起点终点显示部分
                $(".showStartEnd").show();

                // 商家搜索模块隐藏
                $(".search").hide();

                // 定义起点位置
                startPlace = e.name;
                $(".startPlace").html(startPlace);
                p++;
            };
            click++;
        } else {
            if (p == 2) {

                $(".setEnd").show(300);
                // 设置终点函数
                setEnd = function () {
                    // 设置终点nodeId
                    endPID = e.nodeId;
                    map.endPID = e.nodeId;
                    $(".setEnd").hide(300);
                    // 判断起点终点是否一致，一致提醒错误
                    if (startPID & endPID) {

                        if (startPID == endPID) {
                            alert("起点终点相同，请重新设置");
                        }
                        // 定义终点位置
                        endPlace = e.name;
                        $(".endPlace").html(endPlace);

                        // 寻路事件
                        map.searchPath(function (msg) {

                            if (msg.type == "done") {
                                // 地图缩放比
                                map.zoomLevel(12);
                                // // 设置地图仰角
                                map.setPolarAngle(40);

                                map.simulate();
                                //  显示取消寻路按钮
                                $(".cancelSearch").show();
                            } else {
                                alert("寻路失败");
                                map.clearPath(true);
                            }
                        });
                    }
                    p--;
                };
            }
            click--;
        }
    }


    /**
     *@description 起点终点调转事件
     */
    $(".reverse").on("click", function () {
        [map.endPID, map.startPID] = [map.startPID, map.endPID];
        [endPlace, startPlace] = [startPlace, endPlace];
        $(".startPlace").html(endPlace);
        $(".endPlace").html(startPlace);
    });

    /**
    *@description 寻路取消按钮
    */
    cancelSearch = function () {

        map.clearPath(true);
        map.zoomLevel(20);
        map.setPolarAngle(0);
        $(".cancelSearch").hide();
        // 起点终点显示模块隐藏
        $(".showStartEnd").hide();
        // 商家搜索显示
        $(".search").show();

        // 搜索框相应事件
        $(".search input").val("");
        $(".search .icon-sousuo").show();
        $(".search span").hide();

        map.setAzimuthalAngle(45);
    };

    /**
     *@description 起点取消按钮事件
     */
    cancelStart = function () {
        $(".setStart").hide(300);
        cancelSearch();
        click--;

    };

    /**
     *@description 终点取消按钮事件
     */
    cancelEnd = function () {
        $(".setEnd").hide(300);
        click++;
    };

    /**
     *@description 起点终点显示模块back事件
     */
    $(".back").on("click", function () {
        cancelSearch();
        // 商家搜索显示
        $(".search").show();

        // 清除起点终点内容
        startPID = "";
        endPID = "";
        $(".startPlace").html("");
        $(".endPlace").html("");
        click = 1;
        p = 1;
    });

    /**
     *@description 商家搜索模块
     */
    $(".search input").on("focus", function () {
        $(".search_part").show();
        $(".search .icon span").show();
        $(".search .icon-sousuo").hide();
    })
    $(".search .icon span").on("click", function () {
        $(".search_part").hide();
        $(".search .icon-sousuo").show();
        $(".search .icon span").hide();
        $(".fuzzy_search").hide();
        $(".search input").val("");
    })

    /**
     *@description 模糊搜索功能
     */
    $(".search input").on("keyup", function () {
        // 每次匹配字符串的时候初始化
        $(".fuzzy_search ul").html("");
        let searchText = $(".search input").val().trim().toLocaleLowerCase(),
            len = 0;
        $(".search_part").hide();
        $(".fuzzy_search").show();

        // 遍历模糊搜索
        testSearch.forEach(element => {
            var shopName = element.name.toLocaleLowerCase();
            if (shopName.indexOf(searchText) != -1 & searchText.length != 0) {
                $(".fuzzy_search .no_result").hide();
                $(".fuzzy_search ul").show();
                $(".fuzzy_search ul").append(`
                <li class="search_point" onclick="setPoint('${element.bindShopId}','${element.name}','${element.floor}')">
                <div class="search_result">
                    <p>${element.name}</p>
                    <p>楼层${element.floor}</p>
                </div>
                </li>
                `);
                // 只要有符合条件的就让len加一
                len++;
            }
        });
        // 当len等于0则证明没有找到相关数据 此时显示no_result页
        if (len == 0) {
            console.log("没找到")
            $(".fuzzy_search ul").hide();
            $(".fuzzy_search .no_result").show();
        }
    })

    /**
     *@description 点击历史搜索结果列表跳转至搜索结果页
     *@param {*} li  
     *@param {*} bindShopId
     *@param {*} floor
     */
    hisLiBtn = function (li, bindShopId, floor) {
        $(".fuzzy_search ul").html("");
        $(".fuzzy_search").show();
        let name = $(li).html().toLowerCase();
        console.log(bindShopId);
        $(".fuzzy_search ul").append(`
        <li class="search_point" onclick="setPoint('${bindShopId}','${name}','${floor}')">
        <div class="search_result">
            <p>${name}</p>
            <p>楼层${floor}</p>
        </div>
        </li>
        `)
    }

    /**
     *@description 根据店铺ID跳转到相应店铺
     *@param {*} bindShopId  
     *@param {*} shopName
     *@param {*} floor
     */
    setPoint = function (bindShopId, shopName, floor) {
        $(".search_part").hide();
        $(".fuzzy_search").hide();
        $(".search input").val(shopName);
        map.focusToShopByID(bindShopId);
        // 地图缩放比
        map.zoomLevel(12);
        // 设置地图仰角
        map.setPolarAngle(40);
        var shopName_show = $(".his_list ul li").text().toLocaleUpperCase(),
            shopName = shopName.toLocaleUpperCase(),
            h = `
            <li onclick="hisLiBtn(this,'${bindShopId}','${floor}')">${shopName}</li>
            `;
        shopName = shopName.toLocaleUpperCase();
        // 判断是否存在该历史搜索项，如果存在则不再渲染内容，如果不存在新搜索的内容追加到后搜索的内容之前
        if (shopName_show != shopName) {
            $('.his_list ul li').length > 0 ? $('.his_list ul').children('li').eq(0).before(h) : $('.his_list ul').append(h);
        } else {
            return
        }
    }

    /**
     *@description 清空历史记录
     */
    clearHistory = function () {
        $(".his_list ul").html("");
    }

    /**
     *@description 3d切换
     */
    mapToggle = function () {
        let value = $('.map_three').text();
        if (value == '3D') {
            map.setPolarAngle(60)
            $('.map_three').text('2D');
        } else {
            map.setPolarAngle(0)
            $('.map_three').text('3D');
        }
    }

    /**
     *@description 放大地图
     */
    biger = function () {
        if (map.cameraRadius - 1000 < map.minCameraRadius) {
            map.cameraRadius = 1000;
        } else {
            map.cameraRadius = map.cameraRadius - 1000;
        }
    }

    /**
     *@description 缩小地图
     */
    smaller = function () {
        if (map.cameraRadius < map.maxCameraRadius) {
            if ((map.cameraRadius + 1000) > map.maxCameraRadius) {
                map.cameraRadius = 8000;
            } else {
                map.cameraRadius = map.cameraRadius + 1000;
            }
        }
    }

    /**
     *@description 模拟导航结束之后回调函数
     */
    map.regNavigationComplete(function () {
        /**
         * 模拟导航结束之后初始化地图旋转角度
         */
        map.setAzimuthalAngle(45);
    })

});