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

      _.bindAll(this, 'on_keydown');
      $(document).bind('keydown', this.on_keydown);
      this.listenTo( this.collection, 'change:endTime', this.onChangeEndTime );

      this.render();
    },

    render: function(values){
      this.$el.html(this.template(values));
      return this;
    },

    //Запуск игры (1 игрок)
    play: function() {
      this.$el.find('#main-menu').css({'animation': 'scale_main_control0 1s forwards'});
      this.$el.find('#btn-play').trigger('blur');

      this.collection.setCarsInRace(1);
      this.scene.beginRace(function(scope){
          scope.$el.find('#btn-back').css({'visibility': 'visible'});      
        },
        this);
    },

    //Запуск игры (2 игрока)
    play2: function() {
      this.$el.find('#main-menu').css({'animation': 'scale_main_control0 1s forwards'});
      this.$el.find('#btn-play').trigger('blur');

      this.collection.setCarsInRace(2);
      this.scene.beginRace(function(scope){
          scope.$el.find('#btn-back').css({'visibility': 'visible'});      
        }, 
        this);
    },

    //Прерывание игры
    back: function() {
      this.$el.find('#main-menu').css({'animation': 'scale_main_control1 1s forwards'});
      this.$el.find('#btn-back').css({'visibility': 'hidden'});
      this.$el.find('#btn-play').trigger('focus');

      this.scene.breakRace();
    },

    //Возврат в главный раздел меню
    back2: function() {
      this.template = template('main');
      this.render();
    },

    //Показываем кнопки управления
    controls: function() {
      this.template = template('controls');
      this.render({ data: config['cars']['items'] });
    },

    //Показываем результаты заездов
    results: function() {

      //Получаем рейтинг победителей
      try {
        
        this.db.selectValues(
          'results', 
          [],
          function(data, scope) {
            scope.template = template('results');
            scope.render({ 'data': data.rows });
          },
          this
        );

      } catch (err) {
        console.log("DB Error: " + err.message);
      }
    },
    
    //Обработка нажатия клавиш управления машиной
    on_keydown: function(e) {
      var cars = this.collection.carsInRace();
      
      cars.each(function(car){
        car.controlCar(e.keyCode || e.charCode);
      });
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
    }
  });

  return new MainView;
};