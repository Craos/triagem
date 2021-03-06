class Condomino {

    Pesquisar(placa) {

        return new Promise(((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: window.config.endpoint + '/triagem/pesquisa_condomino?placa=eq.' + placa,
                dataType: "json",
                headers: {
                    Accept: "application/vnd.pgrst.object+json"
                },
                success: function (response) {
                    resolve(response);
                }
            });
        }))
    }
}