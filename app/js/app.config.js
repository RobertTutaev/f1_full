function getConfig(){

    return {
        //Id елемента для отрисовки
        canvasEl: '#main-canvas',
        //Id невидимого елемента для анализа съезда машин с дороги
        canvasAnalysisEl: '#analysis-canvas',
        //Общая ширина сцены
        canvasWidth: 1016,
        //Общая высота сцены
        canvasHeight: 762,
        //Порядковый номер слоя местности используемый для анализа заезда машин на обочину и препятствия
        stagesNumber: 0,
        //Слои для отрисовки местности
        stages: [
            {
                urlXML: 'img/racing-pack/Spritesheets/spritesheet_tiles.xml',
                urlIMG: 'img/racing-pack/Spritesheets/spritesheet_tiles.png',
                map: [
                    [['land_grass11.png',0  ,0  ,0,1,1], ['land_grass11.png',127,0  ,0,1,1], ['land_grass11.png',254,0  ,0,1,1], ['land_grass01.png',381,0  ,0,1,1], ['land_grass09.png',508,0  ,0,1,1],  ['land_grass09.png',635,0  ,0,1,1], ['land_grass09.png',762,0  ,0,1,1],  ['land_grass02.png',889,0  ,0,1,1]],
                    [['land_grass01.png',0  ,127,0,1,1], ['land_grass09.png',127,127,0,1,1], ['land_grass09.png',254,127,0,1,1], ['land_grass10.png',381,127,0,1,1], ['land_grass12.png',508,127,0,1,1],  ['land_grass13.png',635,127,0,1,1], ['land_grass14.png',762,127,0,1,1],  ['land_grass03.png',889,127,0,1,1]],
                    [['land_grass05.png',0  ,254,0,1,1], ['land_grass12.png',127,254,0,1,1], ['land_grass13.png',254,254,0,1,1], ['land_grass13.png',381,254,0,1,1], ['land_grass07.png',508,254,0,1,1],  ['land_grass11.png',635,254,0,1,1], ['land_grass05.png',762,254,0,1,1],  ['land_grass03.png',889,254,0,1,1]],
                    [['land_grass05.png',0  ,381,0,1,1], ['land_grass03.png',127,381,0,1,1], ['land_grass11.png',254,381,0,1,1], ['land_grass01.png',381,381,0,1,1], ['land_grass09.png',508,381,0,1,1],  ['land_grass09.png',635,381,0,1,1], ['land_grass10.png',762,381,0,1,1],  ['land_grass03.png',889,381,0,1,1]],
                    [['land_grass05.png',0  ,508,0,1,1], ['land_grass08.png',127,508,0,1,1], ['land_grass09.png',254,508,0,1,1], ['land_grass10.png',381,508,0,1,1], ['land_grass12.png',508,508,0,1,1],  ['land_grass13.png',635,508,0,1,1], ['land_grass13.png',762,508,0,1,1],  ['land_grass07.png',889,508,0,1,1]],
                    [['land_grass06.png',0  ,635,0,1,1], ['land_grass13.png',127,635,0,1,1], ['land_grass13.png',254,635,0,1,1], ['land_grass13.png',381,635,0,1,1], ['land_grass07.png',508,635,0,1,1],  ['land_grass11.png',635,635,0,1,1], ['land_grass11.png',762,635,0,1,1],  ['land_grass11.png',889,635,0,1,1]]
                ],
            },

            {
                urlXML: 'img/racing-pack/Spritesheets/spritesheet_objects.xml',
                urlIMG: 'img/racing-pack/Spritesheets/spritesheet_objects.png',
                map: [
                    [['arrow_white.png'     ,112,440,0    ,0.2,0.2], ['arrow_white.png' ,405,239,1.57 ,0.2,0.2], ['arrow_white.png',907,320,-3.14,0.2,0.2], ['arrow_white.png' ,620,526,-1.57,0.2,0.2]],
                    [['skidmark_long_2.png' ,105,505,0.1  ,0.5,0.5]],
                    [['oil.png'             ,75 ,580,0    ,0.6,0.6], ['oil.png'         ,956,380,1.7  ,0.6,0.6]], 
                    [['rock2.png'           ,130,120,0    ,1  ,1  ], ['rock1.png'       ,390,320,0    ,1  ,1  ], ['rock3.png'      ,920,0  ,0.1 ,1   ,1  ], ['rock2.png'       ,944,34 ,0    ,1  ,1  ], ['rock2.png'           ,50 ,675,1  ,1  ,1  ]],
                    [['barrier_red_race.png',590,370,-0.05,1  ,1  ], ['barrier_red.png' ,710,590,-0.02,1  ,1  ]],
                    [['tent_blue.png'       ,640,225,-0.1 ,1  ,1  ]],
                    [['barrel_red_down.png' ,340,60 ,0.1  ,1  ,1  ], ['barrel_red.png'  ,280,60 ,0    ,1  ,1  ], ['barrel_red.png' ,305,5  ,0   ,1   ,1  ], ['barrel_blue.png' ,365,7  ,0    ,1  ,1  ], ['barrel_blue_down.png',85 ,707,0.1,1  ,1  ], ['barrel_blue.png',155 ,707,0  ,1  ,1  ]],
                    [['tree_small.png'      ,0  ,50 ,0    ,1  ,1  ], ['tree_small.png'  ,130,5  ,0    ,1  ,1  ], ['tree_small.png' ,300,420,0   ,1   ,1  ], ['tree_small.png'  ,870,623,0    ,1  ,1  ], ['tree_small.png'      ,641,559,0.7,1  ,1  ]],
                    [['tree_large.png'      ,207,314,0.1  ,1  ,1  ]],
                    [['barrier_white.png'   ,385,705,-1.59,.64,0.2]]
                ],
            }
        ],
        //машины
        cars: {
            urlXML: 'img/racing-pack/Spritesheets/spritesheet_vehicles.xml',
            urlIMG: 'img/racing-pack/Spritesheets/spritesheet_vehicles.png',
            defaultCar: 0,
            items: [
                {
                    name: 'BMW',
                    img: 'car_black_small_5.png',
                    imgRotation: 1.57,
                    maxSpeed: 3,
                    minSpeed: -1,
                    beginX: 445,
                    beginY: 617,
                    beginRotation: -3.14,
                    controlKeys: {
                        87 : 'up', 
                        83 : 'down',
                        90 : 'stop',
                        65 : 'left', 
                        68 : 'right'
                    }
                },

                {
                    name: 'KIA',
                    img: 'car_red_small_2.png',
                    imgRotation: 1.57,
                    maxSpeed: 4,
                    minSpeed: -1,
                    beginX: 445,
                    beginY: 662,
                    beginRotation: -3.14,
                    controlKeys: {
                        73 : 'up', 
                        75 : 'down',
                        77 : 'stop',
                        74 : 'left', 
                        76 : 'right'
                    }
                }
            ],
            //демо - машина при старте
            intro: {
                img: 'car_green_1.png',
                imgRotation: 1.57,
                beginAlpha: 1,
                beginX: 1016,
                beginY: 381,
                endX: 0,
                endY: 381,
                endAlpha: 0
            }
        },
        //Цвет бордюра дороги за который машины не должны выезжать
        roadEndColor: [47, 192, 108],
        //"Чекпоинты" по приоритетности проезда
        roadCheckPoints: [
            [50 ,370,200,412],
            [407,180,454,330],
            [818,307,965,353],
            [616,432,662,585],
            [360,562,400,710]
        ],
        //база данных (Web SQL)
        db: {
            name: 'carsDB',
            label: 'The best results of the races',
            version: '0.1',
            size: 1024*1024*5,
            errorDBConnectMessage: 'Failed to connect to database',
            tables: [
                {
                    name: 'results',
                    createSQL:  "CREATE TABLE results (id INTEGER primary key autoincrement, name TEXT, result REAL, date_time DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))",
                    checkSQL:   "SELECT COUNT(*) FROM results",//"DROP TABLE results",//
                    insertSQL:  "INSERT INTO results (name, result) values(?, ?)",
                    selectSQL:  "SELECT * FROM results ORDER BY result, id DESC LIMIT 10"
                }
            ]
        }
    };
};