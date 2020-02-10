class Tipoacesso {

    listar(callback) {
        $.ajax({
            type: "GET",
            url: window.config.endpoint + '/triagem/tipo_acesso',
            dataType: "json",
            success: function (response) {
                callback(response);
            },
            async: false
        });
    }

}