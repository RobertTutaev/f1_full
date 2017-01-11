function getMainView() {

  var MainView = Backbone.View.extend({
    
    el: '#main-control',
    db: {},
    collection: {},
    template: template('main'),    

    events: {
      'click #btn-play'     : 'play',
      'click #btn-play2'    : 'play2',
      'click #btn-back'     : 'back',
      'click #btn-back2'    : 'back2',
      'click #btn-back3'    : 'back2',
      'click #btn-controls' : 'controls',
      'click #btn-results'  : 'results'
    },

    initialize: function() {      
      this.collection = new СarsCollection();
      this.scene = new MainScene(this.collection);
      try {
        this.db = new DB();
      } catch (err) {
        console.log("DB Error: " + err.message);
      }

      _.bindAll(this, 'on_keypress');
      $(document).bind('keypress', this.on_keypress);
      this.listenTo( this.collection, "change:endTime", this.onChangeEndTime );

      this.render();
    },

    render: function(value){
      this.$el.html(this.template({ data: value }));
      return this;
    },

    //Запуск игры (1 игрок)
    play: function() {
      $(this.$el).find('#main-menu').css({'animation': 'scale_main_control0 1s forwards'});
      $(this.$el).find('#btn-back').css({'visibility': 'visible'});
      $(this.$el).find('#btn-play').trigger('blur');

      this.collection.setCarsInRace(1);
      this.scene.beginRace();
    },

    //Запуск игры (2 игрока)
    play2: function() {
      $(this.$el).find('#main-menu').css({'animation': 'scale_main_control0 1s forwards'});
      $(this.$el).find('#btn-back').css({'visibility': 'visible'});
      $(this.$el).find('#btn-play').trigger('blur');

      this.collection.setCarsInRace(2);
      this.scene.beginRace();
    },

    //Прерывание игры
    back: function() {
      $(this.$el).find('#main-menu').css({'animation': 'scale_main_control1 1s forwards'});
      $('#btn-back').css({'visibility': 'hidden'});
      $(this.$el).find('#btn-play').trigger('focus');
      this.scene.breakRace();
    },

    //Возврат в главный раздел меню
    back2: function() {
      this.template = template('main');
      this.render();
    },

    //Показываем кнопки управления
    controls: function() {

      //Получаем кнопки управления 
      function getData() {
        var result = '';
        
        for (var i = 0; i < config['cars']['items'].length; i++) {
          result = result + '<ul> Car: <b>' + config['cars']['items'][i]['name'] + '</b>';          
          for (key in config['cars']['items'][i]['controlKeys']) {
            result = result +'<li><b>"' + key + '"</b> - ' + config['cars']['items'][i]['controlKeys'][key] + '</li>';
          }          
          result = result + '</ul>';
        }
        return result;
      };

      this.template = template('controls');
      this.render(getData());
    },

    //Показываем результаты заездов
    results: function() {

      //Сохраняем Scope
      var scope = this;

      //Получаем рейтинг победителей
      try {
        
        this.db.selectValues(
          'results', 
          [],
          function(tx, data) {
            var result = '<table><tr><th>№</th><th>Car</th><th>Time (s)</th><th>Сhronology</th></tr>';
            
            for(var i = 0; i < data.rows.length; i++) {
              result = result + 
                '<tr>' +
                  '<td>' + (i + 1) + '</td>' + 
                  '<td>' + data.rows.item(i)['name'] + '</td>' + 
                  '<td>' + data.rows.item(i)['result'] + '</td>' + 
                  '<td>' + data.rows.item(i)['date_time'] + '<td>' +
                '</tr>';
            }
            result = result + '</table>';
            
            scope.template = template('results');
            scope.render(result);
          }
        );

      } catch (err) {
        console.log("DB Error: " + err.message);
      }
    },
    
    //Обработка нажатия клавиш управления машиной
    on_keypress: function(e) {

      var char = getChar(e);
      var cars = this.collection.carsInRace();

      cars.each(function(car){
        car.controlCar(char);
      });

      function getChar(event) {
        if (event.which == null) {                    // IE
          if (event.keyCode < 32) return null;        // спец. символ
          return String.fromCharCode(event.keyCode)
        }

        if (event.which != 0 && event.charCode != 0) {// все кроме IE
          if (event.which < 32) return null;          // спец. символ
          return String.fromCharCode(event.which);    // остальные
        }

        return null;                                  // спец. символ
      }
    },

    //Слушаем завершение гонок
    onChangeEndTime: function(car) {      
      if (car.get('endTime') !==0 ) {
        try {
          this.db.insertValues('results', [car.get('name'), ( car.get('endTime') - car.get('beginTime') ) / 1000]);
        } catch (err) {
          console.log("DB Error: " + err.message);
        }        
      }

      if ( this.collection.countCarsInRace() === 0 ) {
        //alert('The end');
      };
    }
  });

  return new MainView;
};