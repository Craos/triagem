class Tipoacesso {

    listar(callback) {
        $.ajax({
            type: "GET",
            url: 'http://anima.craos.net/triagem/tipo_acesso',
            dataType: "json",
            success: function (response) {
                callback(response);
            },
            async: false
        });
    }

}