function Atlas( urlXML, urlIMG, callback ) {
    var atlas;              // Текстурный атлас
    var atlasValues = [];   // Массив содержащий характеристики всех текстур атласа

    //Выполняем примитивные проверки и работаем с данными
    if (!(urlXML === undefined || urlXML === '' || urlIMG === undefined || urlIMG === '')) {
        atlas = new PIXI.BaseTexture.fromImage(urlIMG);
        
        loadAndParseXML();
    } else {
        throw new Error('Some error: {urlXML: ' + urlXML +', urlIMG: ' + urlIMG + '}');
    }

    //Получаем массив содержащий характеристики всех текстур атласа
    this.getAtlasValues = function() {
        return atlasValues;
    }

    //Получаем текстуру по имени
    this.getTexture = function(name) {
        if (atlasValues[name] !== undefined) {
            return new PIXI.Texture(
                atlas,
                new PIXI.Rectangle(
                    atlasValues[name]['x'], 
                    atlasValues[name]['y'], 
                    atlasValues[name]['w'], 
                    atlasValues[name]['h']));
        } else {
            throw new Error('Texture not found: {name: ' + name + '}');
        }
    }
    
    //Загрузка XML
    function loadAndParseXML() {
        var httpRequest;

        if (window.XMLHttpRequest) {
            httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        httpRequest.open('GET', urlXML);
        
        httpRequest.onload = function (e) {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var XMLDoc = httpRequest.responseXML;
                var els = XMLDoc.getElementsByTagName("SubTexture");

                for (var i = 0; i < els.length; i++) {                    
                    atlasValues[els[i].getAttribute("name")] = {
                        'x':parseInt(els[i].getAttribute("x")), 
                        'y':parseInt(els[i].getAttribute("y")), 
                        'w':parseInt(els[i].getAttribute("width")), 
                        'h':parseInt(els[i].getAttribute("height"))
                    };
                }

                callback();
            }
        };        

        httpRequest.send();
    }
};