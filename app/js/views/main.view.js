function getMainView() {

  var MainView = Backbone.View.extend({
    
    el: '#main-control',
    db: {},
    changeEl: null,
    collection: {},
    template: template('main'),

    events: {
      'click #btn-play'     : 'play',
      'click #btn-play2'    : 'play2',
      'click #btn-back'     : 'back',
      'click #btn-back2'    : 'back2',
      'click #btn-back3'    : 'back2',
      'click #btn-controls' : 'controls',
      'click #btn-results'  : 'results',
      'click .btn-f1'       : 'change'
    },

    initialize: function() {
      this.collection = new СarsCollection();
      this.scene = new MainScene(this.collection);

      try {
        this.db = new DB();
      } catch (err) {
        console.log('DB Error: ' + err.message);
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
        }, this);
    },

    //Запуск игры (2 игрока)
    play2: function() {
      this.$el.find('#main-menu').css({'animation': 'scale_main_control0 1s forwards'});
      this.$el.find('#btn-play2').trigger('blur');

      this.collection.setCarsInRace(2);
      this.scene.beginRace(function(scope){
          scope.$el.find('#btn-back').css({'visibility': 'visible'});      
        }, this);
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

    //Включаем/выключаем РЕЖИМ изменения управления машиной
    change: function(e) {
      var newChangeEl = $(e.currentTarget);
      newChangeEl.trigger('blur');

      if ( this.changeEl ) {
        if ( this.changeEl.attr('id') === newChangeEl.attr('id') ) {
          this.сhange_on(false);
          this.changeEl = null;
        } else {
          this.сhange_on(false);
          this.changeEl = newChangeEl;
          this.сhange_on(true);
        }
      } else {
        this.changeEl = newChangeEl;
        this.сhange_on(true);
      }
    },

    //Включаем/выключаем КНОПКУ изменения управления машиной
    сhange_on: function(on) {
      this.changeEl.removeClass('btn-default btn-warning');

      if ( on ) {
        this.changeEl.text('Cancel');
        this.changeEl.addClass('btn-warning');
      } else {
        this.changeEl.text('Change');
        this.changeEl.addClass('btn-default');
      }
    },

    //Изменяем кнопку управления машиной
    change_key: function(code) {
      var id = this.changeEl.attr('id');
      var pos = id.indexOf('_');
      var i = id.substring(1, pos);
      var key = id.substring(pos+1);
      
      config['cars']['items'][i]['controlKeys'][key] = code;                  //изменяем config
      $( '#k' + i + '_' + key ).html( '"' + String.fromCharCode(code) + '"' );//обновляем новую кнопку
    },

    //Показываем результаты заездов
    results: function() {

      //Получаем рейтинг победителей
      try {
        
        this.db.selectValues(
          'results',
          [],
          function(d, scope) {
            scope.template = template('results');
            scope.render({ data: d.rows });
          }, this);

      } catch (err) {
        console.log('DB Error: ' + err.message);
      }
    },
    
    //Обработка нажатия клавиш
    on_keydown: function(e) {
      var cars = this.collection.carsInRace();
      var code = e.keyCode || e.charCode;

      if ( this.changeEl ) {
        this.change_key(code);
        this.сhange_on(false);
        this.changeEl = null;
      } else {
        cars.each(function(car){
          car.controlCar(code);
        });
      }
    },

    //Слушаем завершение гонок
    onChangeEndTime: function(car) {      
      if (car.get('endTime') !==0 ) {
        try {
          this.db.insertValues('results', [car.get('name'), ( car.get('endTime') - car.get('beginTime') ) / 1000]);
        } catch (err) {
          console.log('DB Error: ' + err.message);
        }        
      }
    }
  });

  return new MainView;
};