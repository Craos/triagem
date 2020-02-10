class Estacionamentos {

    lista(callback) {
        $.ajax({
            type: "GET",
            url: 'http://anima.craos.net/triagem/estacionamentos',
            dataType: "json",
            success: function (response) {
                callback(response);
            },
            async: false
        });
    }

    Situacao(callback) {
        $.ajax({
            type: "GET",
            url: 'http://anima.craos.net/triagem/situacao',
            dataType: "json",
            success: function (response) {
                callback(response);
            }
        });
    }

}