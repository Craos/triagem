class Vaga {

    Criar() {

        let dvaga = document.createElement('div');
        dvaga.className = 'vaga';

        let linha1 = document.createElement('div');
        linha1.className = 'vaga-linha1';

        let numero = document.createElement('div');
        numero.className = 'vaga-numero fl';
        numero.innerText = this.data.numero;

        let unidade = document.createElement('div');
        unidade.className = 'vaga-unidade fr';

        let placa = document.createElement('div');
        placa.className = 'vaga-placa';

        let tempo = document.createElement('div');
        tempo.className = 'vaga-tempo';

        if (this.data.autenticacao) {

            unidade.innerText = '(' + this.data.bloco + ' - ' + this.data.unidade + ')';
            placa.innerText = this.data.placa;
            tempo.innerText = this.data.tempo;
            dvaga.className = (this.data.prazo > 0) ? 'vaga intermitente' : 'vaga vaga-ocupada';
            dvaga.data = this.data;

        }

        if (this.data.tipo !== 'Normal') {
            placa.style.backgroundImage = "url('./img/" + this.data.img + "')";
        }

        dvaga.onclick = function () {
            let autorizacao = new Triagem();
            autorizacao.data = this.data;
            autorizacao.Iniciar();

        }.bind(this);

        linha1.appendChild(numero);
        linha1.appendChild(unidade);

        dvaga.appendChild(linha1);
        dvaga.appendChild(placa);
        dvaga.appendChild(tempo);

        return dvaga;

    }

    Liberar(id) {
        return new Promise(((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: window.config.endpoint + '/triagem/rpc/liberar',
                dataType: "json",
                headers: {
                    Prefer: "return=representation",
                    Accept: "application/vnd.pgrst.object+json"
                },
                success: function (response) {
                    resolve(response);
                },
                data: {
                    id: id
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: jqXHR.responseJSON.message
                });
                reject(new Error("Deu erro"));
            });
        }))
    }
}