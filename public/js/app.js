let tiposdeacesso, listaestacionamentos;

let App = function () {

    /**
     * @todo Verificar a atualização do painel que está desaparecendo
     * @param buttons
     */
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
        console.debug('atualizaPainel');
        layout.attachEvent('onContentLoaded', function (id) {
            console.debug('página carregada');
            new Painel().Montar(layout.cells(id).getFrame());
        });
        layout.cells('a').attachURL('html/painel.html');
        console.info(new Date(), 'Atualização do painel');
    };

    document.addEventListener('AoAlterarVaga', this.atualizaPainel);
    setInterval(this.atualizaPainel, 550000);
    this.atualizaPainel();

    this.ObterIPOrigem = function () {
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
    }

};

const regexPlate = /^[a-zA-Z]{3}[0-9]{4}$/;
const regexPlateMerc = /^[a-zA-Z]{3}[0-9]{1}[a-zA-Z]{1}[0-9]{2}$/;

function validatePlate(plate) {

    if (plate === undefined || plate === null || plate.length < 7) {
        console.warn('Placa inválida');
        return false;

    } else if (regexPlate.test(plate)) {
        console.warn('Placa válida (padrão atual)');
        return true;

    } else if (regexPlateMerc.test(plate)) {
        console.warn('Placa válida (padrão mercosul)');
        return true;

    } else {
        console.error('Placa inválida no padrão atual e mercosul');
        return false;
    }
}

function validateDOC(doc) {
    return !(doc === undefined || doc === null || doc.length < 6);
}

function validateName(name) {
    return !(name === undefined || name === null || name.length < 3);
}