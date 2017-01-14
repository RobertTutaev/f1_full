function AnalysisScene(stage) {

    var canvas = document.createElement('canvas');
    var context =  canvas.getContext('2d');
    var renderer = new PIXI.CanvasRenderer(config['canvasWidth'], config['canvasHeight'], {view: canvas});

    renderer.render(stage); //рисуем сцену для анализа заезда на обочину

    //Анализ движения машины
    this.analysis = function(carModel, carSprite) {
        var incrementX = carModel.get('speedX') + Math.sign( carModel.get('speedX') + 0.0001 );
        var incrementY = carModel.get('speedY') + Math.sign( carModel.get('speedY') + 0.0001 );
        var pix = context.getImageData(
                carSprite.position.x,
                carSprite.position.y,
                incrementX,
                incrementY
            ).data;

        //Если обочина, то останавливаем машину
        for (var j = 0, n = pix.length; j < n; j += 4) {
            if ( pix[j] === config['roadEndColor'][0] && pix[j + 1] === config['roadEndColor'][1] && pix[j + 2] === config['roadEndColor'][2] ) {
                
                carModel.stop();
                return carModel;
            }
        };

        //Если граница сцены, то останавливаем машину
        var newX = carSprite.position.x + incrementX;
        var newY = carSprite.position.y + incrementY;

        if ( newX < 0 || newX > config['canvasWidth'] || newY < 0 || newY > config['canvasHeight'] ) {

            carModel.stop();
        }
        
        //Возвращаем модель
        return carModel;
    };
};