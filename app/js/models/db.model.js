//Компонент для работы с БД
function DB() {

    //cоединение с БД
    var db = openDatabase(
            config['db']['name'],
            config['db']['version'],
            config['db']['label'],
            config['db']['size']);
   
    //коллекция таблиц
    var tables = new Backbone.Collection();

    tables.on('add', function(table) {
        if (!db) {
            console.log(config['db']['errorDBConnectMessage']);
        } else {
            db.transaction(function(tx) {
                tx.executeSql(
                    table.get('checkSQL'), //проверяем наличие таблицы
                    [],
                    null,
                    function (tx, error) {
                        tx.executeSql(
                            table.get('createSQL'), //создаем таблицу
                            [],
                            null,
                            function (tx, error) {
                                console.log("Query Error: " + error.message);
                            }
                        );
                    }
                );
            });
        }
    });

    //добавление таблиц в БД
    tables.add(config['db']['tables']);

    // Получение результатов заездов
    this.selectValues = function(tableName, arrayValues, callback, options) {
        db.transaction(function(tx) {
            tx.executeSql(
                tables.findWhere({name: tableName}).get('selectSQL'),
                arrayValues,
                function(tx, data) {
                    callback(data, options);
                },
                function (tx, error) {
                    console.log("Query Error: " + error.message);
                }
            )
        });
    };

    // Добавление результата заезда
    this.insertValues = function(tableName, arrayValues) {       
        db.transaction(function(tx) {
            tx.executeSql(
                tables.findWhere({name: tableName}).get('insertSQL'),
                arrayValues,
                null,
                function (tx, error) {
                    console.log("Query Error: " + error.message);
                }
            );
        });
    }
};