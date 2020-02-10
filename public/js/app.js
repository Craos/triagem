let tiposdeacesso, listaestacionamentos;

let App = function () {

    this.criabarradeComandos = function(buttons) {

        buttons.filter(function (item) {

            let img = document.createElement('img');
            img.src = item.img;
            img.className = 'autorizacao-rapida-img';

            let span = document.createElement('span');
            span.innerText = item.innerText;
            span.className = 'autorizacao-rapida-span';

            let button = document.createElement('button');
            button.id = item.id;
            button.appendChild(img);
            button.appendChild(span);
            button.className = 'autorizacao-rapida';
            button.onclick = function () {

                let _autorizacao = new autorizacao();
                _autorizacao.comando = item;

                if (item.campos !== undefined) {
                    _autorizacao.RegistrarComForm();
                } else {
                    _autorizacao.RegistrarExpresso();
                }

            };
            document.querySelectorAll('.dhx_cell_hdr_text')[0].appendChild(button);
        })
    };

    let layout = new dhtmlXLayoutObject({
        parent: document.body,
        pattern: '1C',
        offsets: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        cells: [
            {
                id: 'a'
            }
        ]
    });

    layout.cells('a').setText('');
    this.criabarradeComandos(barradeComandosRapidos);

    this.carregaParametros = function() {
        new Tipoacesso().listar(function (response) {
            tiposdeacesso = response;
        });

        new Estacionamentos().lista(function (response) {
            listaestacionamentos = response;
        })
    };

    this.carregaParametros();

    this.atualizaPainel = function() {

        layout.attachEvent('onContentLoaded', function (id) {
            new Painel().Montar(layout.cells(id).getFrame());
        });
        layout.cells('a').attachURL('html/painel.html');
        console.info(new Date(), 'Atualização do painel');
    };

    document.addEventListener('AoAlterarVaga', this.atualizaPainel);
    setInterval(this.atualizaPainel, 550000);
    this.atualizaPainel();

};