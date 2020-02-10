class Painel {

    constructor() {
        this.estacionamentos = new Estacionamentos();
    }

    Montar(target) {

        this.estacionamentos.Situacao(function (vagas) {

            target.contentWindow.document.body.innerHTML = '';
            listaestacionamentos.filter(function (estacionamento) {

                let itemestacionamento = document.createElement('div');
                itemestacionamento.id = 'estacionamento_'+estacionamento.num;
                itemestacionamento.className = 'estacionamento';

                let estacionamentoheader = document.createElement('div');
                estacionamentoheader.className = 'estacionamento-header';
                estacionamentoheader.innerText = estacionamento.nome;

                let estacionamentobody = document.createElement('div');
                estacionamentobody.className = 'estacionamento-body';

                vagas.filter(function (item) {

                    if (item.estacionamento !== estacionamento.num)
                        return;

                    let vaga = new Vaga();
                    vaga.target = target.contentWindow;
                    vaga.data = item;
                    estacionamentobody.appendChild(vaga.Criar(item));

                });

                itemestacionamento.appendChild(estacionamentoheader);
                itemestacionamento.appendChild(estacionamentobody);
                target.contentWindow.document.body.appendChild(itemestacionamento);

            });
        });
    }

}