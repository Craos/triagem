class Estacionamentos {

    lista(callback) {
        $.ajax({
            type: "GET",
            url: window.config.endpoint + '/triagem/estacionamentos',
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
            url: window.config.endpoint + '/triagem/situacao',
            dataType: "json",
            success: function (response) {
                callback(response);
            }
        });
    }

}