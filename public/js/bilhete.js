class Bilhete {

    Imprimir(tipoacesso, nomeestacionamento) {

        let janelaImprimir = window.open('html/bilhete.html', 'PRINT', 'height=400,width=280,titlebar=no,status=no,scrollbars=no,resizable=no');

        if (janelaImprimir === null) {
            dhtmlx.alert({
                title: 'Atenção',
                type: 'alert-error',
                text: 'Erro ao exibir a janela de impressão.<br>Verifique as permissões de popup do navegador'
            });
            return;
        }

        janelaImprimir.onload = function() {

            janelaImprimir.document.getElementById('data').innerText = this.data.data;
            janelaImprimir.document.getElementById('bloco').innerText = this.data.est_bloco;
            janelaImprimir.document.getElementById('unidade').innerText = this.data.est_unidade;
            janelaImprimir.document.getElementById('tipo_vaga').innerText = this.data.tipo;
            janelaImprimir.document.getElementById('nometipoacesso').innerText = (!tipoacesso) ? tiposdeacesso.find(x => x.num === this.data.est_acesso).descricao : tipoacesso;
            janelaImprimir.document.getElementById('nomeestacionamento').innerText = (!nomeestacionamento) ? listaestacionamentos.find(x => x.num === this.data.estacionamento).nome : nomeestacionamento;
            janelaImprimir.document.getElementById('vaga').innerText = this.data.numero;
            janelaImprimir.window.barcode(this.data.autenticacao);

        }.bind(this);

        janelaImprimir.focus();

    }

    Registrar() {

        return new Promise((resolve, reject) => {

            $.ajax({
                type: "POST",
                url: window.config.endpoint + '/triagem/autorizacao_impressao?select=autenticacao',
                dataType: "json",
                headers: {
                    Prefer: "return=representation",
                    Accept: "application/vnd.pgrst.object+json"
                },
                success: function (response) {
                    resolve(response);
                },
                data: {
                    autenticacao: this.data.autenticacao,
                    condominio: this.data.condominio,
                    data: this.data.data,
                    est_acesso: this.data.est_acesso,
                    est_bloco: this.data.est_bloco,
                    est_entrada: this.data.est_entrada,
                    est_placa: this.data.est_placa,
                    est_unidade: this.data.est_unidade,
                    estacionamento: this.data.estacionamento,
                    final: this.data.final,
                    inicio: this.data.inicio,
                    numero: this.data.numero,
                    tipo: this.data.tipo,
                    uidins: window.user.username
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: jqXHR.responseJSON.message
                });
                reject(new Error("Deu erro"));
            });
        });
    }

}