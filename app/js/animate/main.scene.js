function MainScene(cars) {

    var carsSprites = [];                   //массив спрайтов машин
    var timeSprites = [];                   //массив спрайтов времени заезда
    var atlases = [];                       //массив текстурных атласов (слои карты + машины)
    var carContainer = new PIXI.Container();//PIXI container для машин
    var analysisScene;                      //сцена для анализа выезда машин на обочину или другие препятствия
    var introCar;                           //анимационный спрайт машины при начале гонки
    var introText;                          //анимационный спрайт текста для вывода обратного отчета при начале гонки

    //Запускаем все!
    getAtlases(0);

    //1. Инициаллизируем атласы
    function getAtlases(n) {
        if ( n < config['stages'].length ) {            
            atlases.push(new Atlas(
                config['stages'][n]['urlXML'],
                config['stages'][n]['urlIMG'],
                function() {
                    getAtlases( n + 1 );
                }
            ));
        } else {
            atlases.push(new Atlas(
                config['cars']['urlXML'],
                config['cars']['urlIMG'],
                function() {
                    show();
                }
            ));
        }
    };

    //2. Рендерим сцену
    function show() {
        var renderer = new PIXI.CanvasRenderer(config['canvasWidth'], config['canvasHeight'], {view: $(config['canvasEl'])[0]});
        document.body.appendChild(renderer.view);

        var stage = getPIXIStage();
        
        //Инициаллизируем анимацию
        animate();

        //Анимация
        function animate() {
            requestAnimationFrame(animate);
            //Обработка движения машин
            carsMovement();

            TWEEN.update();

            renderer.render(stage);
        };
    };

    //Старт гонки
    this.beginRace = function(callback, options) {
        //1. Удаляем старые спрайты машин и времени
        this.breakRace();

        //2. Добавляем новые спрайты машин и времени в слой машин, а также выводим эффекты при старте
        //2.1 Эффект с обратным отчетом при старте
        //2.1.1 Выводим 3
        introText.text = '3';
        var temporaryObject = {
            alpha: 1
        };        
        new TWEEN.Tween(temporaryObject)
            .to({
                alpha: 0
            }, 1000)
            .onUpdate(function() {
                introText.alpha = this.alpha;
            })
            .onComplete(function(){

                //2.1.2 Выводим 2
                introText.text = '2';
                var temporaryObject = {
                    alpha: 1
                };                
                new TWEEN.Tween(temporaryObject)
                    .to({
                        alpha: 0
                    }, 1000)
                    .onUpdate(function() {
                        introText.alpha = this.alpha;
                    })
                    .onComplete(function(){

                        //2.1.3 Выводим 1
                        introText.text = '1';
                        var temporaryObject = {
                            alpha: 1
                        };                        
                        new TWEEN.Tween(temporaryObject)
                            .to({
                                alpha: 0
                            }, 1000)
                            .onUpdate(function() {
                                introText.alpha = this.alpha;
                            })
                            .onComplete(function(){

                                //2.1.4 Выводим Go!!!
                                introText.text = 'Go!!!';
                                var temporaryObject = {
                                    alpha: 1
                                };                                
                                new TWEEN.Tween(temporaryObject)
                                    .to({
                                        alpha: 0
                                    }, 1000)
                                    .onUpdate(function() {
                                        introText.alpha = this.alpha;
                                    })
                                    .onComplete(function(){

                                        //2.2 Эффект с машиной при старте
                                        var temporaryObject = {
                                            x: config['cars']['intro']['beginX'],
                                            y: config['cars']['intro']['beginY'],
                                            alpha: config['cars']['intro']['beginAlpha']
                                        };                                        
                                        new TWEEN.Tween(temporaryObject)
                                            .to({
                                                x: config['cars']['intro']['endX'],
                                                y: config['cars']['intro']['endY'],
                                                alpha: config['cars']['intro']['endAlpha']
                                            }, 300)
                                            .onUpdate(function() {
                                                introCar.position.x = this.x;
                                                introCar.position.y = this.y;
                                                introCar.alpha = this.alpha;
                                            })
                                            .onComplete(function(){
                                                introCar.position.x = config['cars']['intro']['beginX'];
                                                introCar.position.y = config['cars']['intro']['beginY'];
                                                introCar.alpha = 0;

                                                //2.3 Добавление спрайтов машин и текста при старте
                                                containerAddCarsAndTimes();

                                                //2.4 Показываем кнопку "Назад"
                                                callback(options);
                                            })
                                            .start();
                                    }) 
                                    .start();
                            }) 
                            .start();
                    }) 
                    .start();
            }) 
            .start();
        
        // Добавление спрайтов
        function containerAddCarsAndTimes() {
            var sprite;

            cars.each(function(car){
                sprite = new PIXI.Text('', {font:"40px Arial", fill:"Gold"});   //время
                sprite.position.y = 40 * timeSprites.length;
                timeSprites.push(sprite);
                carContainer.addChild(sprite);

                car.setDefaults();                                              //машины
                sprite = new PIXI.Sprite(atlases[config['stages'].length].getTexture(car.get('img')));
                sprite.position.x = car.get('beginX');
                sprite.position.y = car.get('beginY');
                sprite.rotation = car.get('imgRotation') + car.get('rotation');
                sprite.alpha = 1;
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                carsSprites.push(sprite);
                carContainer.addChild(sprite);
            });
        };
    };

    //Прерываение гонки (удаляем старые спрайты машин и времени)
    this.breakRace = function() {
        for (var i = 0; i < carsSprites.length; i++) {
            carContainer.removeChild(carsSprites[i]);
            carContainer.removeChild(timeSprites[i]);
        }
        carsSprites = []; 
        timeSprites = [];
    };

    // Вспомогательные операции ====================================================================================================
    // Получаем всю сцену целиком
    function getPIXIStage(){
        var stage = new PIXI.Stage;

        for (var i = 0; i < config['stages'].length; i++) {
            stage.addChild(containerAddChilds(config['stages'][i], atlases[i]));//добавляем по порядку слой местности
            if ( config['stagesNumber'] === i ) {
                analysisScene = new AnalysisScene(stage);                       //задаем сцену для анализа выезда за пределы дороги
            }
        }
                                                                                //создаем спрайт текста для вывода обратного отчета при начале гонки
        introText = new PIXI.Text('', {font:"200px Arial", fill:"MidnightBlue"});
        introText.position.x = config['canvasWidth'] / 2;
        introText.position.y = config['canvasHeight'] /2;
        introText.alpha = 0;
        introText.anchor.x = 0.5;
        introText.anchor.y = 0.5;
        carContainer.addChild(introText);
                                                                                //создаем анимационную машину
        introCar = new PIXI.Sprite(atlases[config['stages'].length].getTexture(config['cars']['intro']['img']));
        introCar.position.x = config['cars']['intro']['beginX'];
        introCar.position.y = config['cars']['intro']['beginY'];
        introCar.rotation = config['cars']['intro']['imgRotation'];
        introCar.alpha = 0;
        introCar.anchor.x = 0.5;
        introCar.anchor.y = 0.5;
        carContainer.addChild(introCar);
        
        stage.addChild(carContainer);                                           //Добавляем слой машин

        return stage;

        //Получаем слой местности
        function containerAddChilds(config, atlas){
            var container = new PIXI.Container();
            var sprite;

            for (var y = 0; y < config['map'].length; y++) {
                for (var x = 0; x < config['map'][y].length; x++) {
                    sprite = new PIXI.Sprite(atlas.getTexture(config['map'][y][x][0]));
                    sprite.position.x = config['map'][y][x][1];
                    sprite.position.y = config['map'][y][x][2];
                    sprite.rotation = config['map'][y][x][3];
                    sprite.scale.x = config['map'][y][x][4];
                    sprite.scale.y = config['map'][y][x][5];
                    container.addChild(sprite);
                }
            }

            return container;
        };
    };

    //Движение машин в слое машин
    function carsMovement() {
        var carModel, endTime, countCheckPoints;

        for(var i = 0; i < carsSprites.length; i++) {
            carsSprites[i].rotation = cars.at(i).get('imgRotation') + cars.at(i).get('rotation');
            
            //Анализируем заезд на обочину
            carModel = analysisScene.analysis(cars.at(i), carsSprites[i]);
            
            //Задаем новое положение машины
            carsSprites[i].position.x = carsSprites[i].position.x + carModel.get('speedX');
            carsSprites[i].position.y = carsSprites[i].position.y + carModel.get('speedY');

            //Время заезда
            if ( cars.at(i).get('endTime') === 0 ){
                //Анализ наезда на "чекпоинт"
                if (
                    config['roadCheckPoints'][cars.at(i).get('checkPointNumber')][0] < carsSprites[i].position.x && 
                    config['roadCheckPoints'][cars.at(i).get('checkPointNumber')][2] > carsSprites[i].position.x &&
                    config['roadCheckPoints'][cars.at(i).get('checkPointNumber')][1] < carsSprites[i].position.y &&
                    config['roadCheckPoints'][cars.at(i).get('checkPointNumber')][3] > carsSprites[i].position.y) {

                        countCheckPoints = cars.at(i).get('checkPointNumber') + 1;
                        //Если наехали на последний "чекпоинт", то останавливаем время
                        if ( countCheckPoints >= config['roadCheckPoints'].length ) {
                            cars.at(i).set({endTime: Date.now()});

                            var temporaryObject = {
                                n: i,
                                width: carsSprites[i].width,
                                height: carsSprites[i].height,
                                alpha: 1
                            };                            
                            new TWEEN.Tween(temporaryObject)
                                .to({
                                    width: temporaryObject.width * 3,
                                    height: temporaryObject.height * 3, 
                                    alpha: 0
                                }, 500)
                                .onUpdate(function() {
                                    carsSprites[this.n].width = this.width;
                                    carsSprites[this.n].height = this.height;
                                    carsSprites[this.n].alpha = this.alpha;
                                })
                                .onComplete(function() {
                                    //Если гонка завершена
                                    if ( cars.countCarsInRace() === 0 ) {

                                        var k = cars.getFastestCarNumber();
                                        var temporaryObject = {
                                            n: k,
                                            x: timeSprites[k].position.x,
                                            y: timeSprites[k].position.y,
                                            width: timeSprites[k].width,
                                            height: timeSprites[k].height,
                                            anchorX: 0,
                                            anchorY: 0
                                        };
                                        new TWEEN.Tween(temporaryObject)
                                            .to({
                                                x: config['canvasWidth'] / 2,
                                                y: config['canvasHeight'] /2,
                                                width: temporaryObject.width * 3,
                                                height: temporaryObject.height * 3,
                                                anchorX: 0.5,
                                                anchorY: 0.5,
                                            }, 500)
                                            .onUpdate(function() {
                                                timeSprites[k].position.x = this.x;
                                                timeSprites[k].position.y = this.y;
                                                timeSprites[k].width = this.width;
                                                timeSprites[k].height = this.height;
                                                timeSprites[k].anchor.x = this.anchorX;
                                                timeSprites[k].anchor.y = this.anchorY;
                                            })
                                            .start();
                                    };
                                })
                                .start();
                        } else {
                            cars.at(i).set({ checkPointNumber: countCheckPoints }); //иначе проехали очередной "чекпоинт"
                        }
                };
                endTime = Date.now();
            } else {
                endTime = cars.at(i).get('endTime');
            }
            timeSprites[i].text = cars.at(i).get('name') + ': ' + ( ( endTime - cars.at(i).get('beginTime') ) / 1000 ) + 's';
        };
    };
};