let ControleEstacionamento = function () {

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

    //this.criabarradeComandos(barradeComandosRapidos);


    siderbar.cells('estacionamento').attachToolbar({
        icon_path: 'img/expresso/',
        items: barracomandosagilidade,
        onClick: function (id) {

            let item = barracomandosagilidade.find(x=>x.id === id);

            let _autorizacao = new autorizacao();
            _autorizacao.comando = item;

            if (item.campos !== undefined) {
                _autorizacao.RegistrarComForm();
            } else {
                _autorizacao.RegistrarExpresso();
            }

        }.bind(this)
    });

    this.carregaParametros = function() {
        new Tipoacesso().listar(function (response) {
            tiposdeacesso = response;
        });

        new Estacionamentos().lista(function (response) {
            listaestacionamentos = response;
        });
    };

    this.carregaParametros();

    this.atualizaPainel = function() {
        siderbar.attachEvent('onContentLoaded', function (id) {
            new Painel().Montar(siderbar.cells(id).getFrame());
        });
        siderbar.cells('estacionamento').attachURL('html/painel.html');
    };

    document.addEventListener('AoAlterarVaga', this.atualizaPainel);
    setInterval(this.atualizaPainel, 550000);
    this.atualizaPainel();


};