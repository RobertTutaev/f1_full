//автомобиль
var Car = Backbone.Model.extend({

  defaults: {
    name: 'carname',
    img: 'car_red_small_2.png',
    imgRotation: 1.57,
    maxSpeed: 5,
    minSpeed: -1,
    rotation: 0,
    speed: 0,
    speedX: 0,
    speedY: 0,
    beginX: 0,
    beginY: 0,
    beginRotation: 0,
    beginTime: 0,
    endTime: 0,
    checkPointNumber: 0,
    controlKeys: {
      up  : 87,
      down: 83,
      stop: 90,
      left: 65,
      right: 68
    }
  },

  validate: function(attrs) {
    if ( attrs.speed > attrs.maxSpeed || attrs.speed < attrs.minSpeed ) {
      return;
    }
  },

  //В целях оптимизации производительности меняем порядок ключей и значений в свойстве "controlKeys"
  initialize: function() {
    var c = this.get('controlKeys');
    var k = [];

    for(var key in c) {
      k[ c[key] ] = key;
    }

    this.set({'controlKeys': k});
  },
 
  controlCar: function(char) {
    switch (this.get('controlKeys')[char]) {
      case 'up':
        this.speedUp();
        break;
      case 'down':
        this.speedDown();
        break;
      case 'stop':
        this.stop();
        break;
      case 'left':
        this.moveLeft();
        break;
      case 'right':
        this.moveRight();
        break;
    }
  },

  calculateSpeedXY: function() {
    var speedY = Math.sin( this.get('rotation') ) * this.get('speed');

    this.set({
      'speedX':   Math.sign(  Math.sin( this.get('rotation') + Math.PI / 2) + 0.0001 ) * Math.sign( this.get('speed') ) * Math.sqrt( Math.pow( this.get('speed'), 2 ) - Math.pow( speedY, 2 ) ),
      'speedY':   speedY
    });
  },

  speedUp: function() {
    this.set({speed: this.get('speed') + 0.3}, {validate: true});
    this.calculateSpeedXY();
  },

  speedDown: function() {
    this.set({speed: this.get('speed') - 0.3}, {validate: true});
    this.calculateSpeedXY();
  },

  stop: function() {
    this.set({speed: 0});
    this.calculateSpeedXY();
  },

  setDefaults: function() {
    this.set({speed: 0, rotation: this.get('beginRotation'), checkPointNumber: 0, beginTime: Date.now(), endTime: 0});
    this.calculateSpeedXY();
  },

  moveLeft: function() {
    this.set({'rotation': this.get('rotation') - 0.2 * Math.sign( this.get('speed') + 0.0001 )});
    this.calculateSpeedXY();
  },

  moveRight: function() {
    this.set({'rotation': this.get('rotation') + 0.2 * Math.sign( this.get('speed') + 0.0001 )});
    this.calculateSpeedXY();
  }
});