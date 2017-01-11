function AnalysisScene(stage) {
    var renderElement = $(config['canvasAnalysisEl'])[0];   //Где отрисовываем
    var context = renderElement.getContext('2d');           //Получаем контекст для анализа столкновения с бордюрами дороги

    //Рисуем сцену
    show();

    function show(){        
        var renderer = new PIXI.CanvasRenderer(config['canvasWidth'], config['canvasHeight'], {view: renderElement});
        document.body.appendChild(renderer.view);

        renderer.render(stage); //рисуем
    }

    //Анализ движения машины
    this.analysis = function(carModel, carSprite) {
        var pix = context.getImageData(
                carSprite.position.x,
                carSprite.position.y,
                carModel.get('speedX') + Math.sign( carModel.get('speedX') + 0.0001 ),
                carModel.get('speedY') + Math.sign( carModel.get('speedY') + 0.0001 )
            ).data;

        //Если бордюр, то останавливаем машину
        for (var j = 0, n = pix.length; j < n; j += 4) {
            if ( pix[j] === config['roadEndColor'][0] && pix[j + 1] === config['roadEndColor'][1] && pix[j + 2] === config['roadEndColor'][2] ) {
                
                carModel.stop();
            }
        }
        
        //Возвращаем модель
        return carModel;
    };
};