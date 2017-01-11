var СarsCollection = Backbone.Collection.extend({

    model: Car,

    //Коллекция машин еще не завершивших гонку
    carsInRace: function() {
        filtered = this.filter(function(car) {
            return car.get('endTime') === 0;
        });
        return new СarsCollection(filtered);
    },

    //Количество машин не завершивших гонку
    countCarsInRace: function() {
        return this.where({endTime: 0}).length;
    },

    //Получаем порядковый номер быстрейшей машины
    getFastestCarNumber: function() {
        var minNumber = -1;
        var minValue = 9999999999999;
        var value;
        var number = 0;

        this.each(function(car){
            value = car.get('endTime');

            if (value !== 0 && minValue > value) {
                minValue = value;
                minNumber = number;
            }

            number++;
        });

        return minNumber;
    },

    //Устанавливаем необходимое количество машин в гонке
    setCarsInRace: function(count) {
        this.reset();

        for (var i = 0; i < count; i++) {
            this.add(config['cars']['items'][i]);
        }
    }
});