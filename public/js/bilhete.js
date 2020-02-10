class Bilhete {

    Imprimir() {

        let janelaImprimir = window.open('html/bilhete.html', 'PRINT', 'height=400,width=280,titlebar=no,status=no,scrollbars=no,resizable=no');

        janelaImprimir.onload = function() {

            janelaImprimir.document.getElementById('data').innerText = this.data.data;
            janelaImprimir.document.getElementById('bloco').innerText = this.data.est_bloco;
            janelaImprimir.document.getElementById('unidade').innerText = this.data.est_unidade;
            janelaImprimir.document.getElementById('tipo_vaga').innerText = this.data.tipo;
            janelaImprimir.document.getElementById('nometipoacesso').innerText = tiposdeacesso.find(x => x.num === this.data.est_acesso).descricao;
            janelaImprimir.document.getElementById('nomeestacionamento').innerText = listaestacionamentos.find(x => x.num === this.data.estacionamento).nome;
            janelaImprimir.document.getElementById('vaga').innerText = this.data.numero;
            janelaImprimir.window.barcode(this.data.autenticacao);

        }.bind(this);

        janelaImprimir.focus();

    }
}