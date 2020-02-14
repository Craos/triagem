let gridcorrente;

class Triagem {

    Iniciar() {

        this.inicioautorizacao = window.dhx.date2str(new Date(), '%Y-%m-%d %H:%i:%s');

        let winAt = new dhtmlXWindows({
            image_path: "codebase/imgs/"
        });

        let winat = "winautorizar";

        winAt.createWindow({
            id: winat,
            width: 360,
            height: 220,
            center: true,
            caption: "Registro de autorização"
        });

        winAt.window(winat).denyMove();
        winAt.window(winat).denyPark();
        winAt.window(winat).denyResize();


        winAt.window("winautorizar").attachToolbar({
            icon_path: 'img/comandos/',
            items: [
                {id: "salvar", type: "button", text: "Salvar", img: "salvar.png"},
                {id: "sep1", type: "separator"},
                {id: "impressao", type: "button", text: "Imprimir", img: "imprimir.png", disabled: (this.data.autenticacao === null)},
                {id: "sep1", type: "separator"},
                {id: "liberar", type: "button", text: "Liberar a vaga", img: "liberar.png", disabled: !(this.data.autenticacao !== null && window.user.userinfo.perfil > 2)}
            ],
            onClick: function (id) {
                if (id === 'salvar') {
                    form.validate();
                } else if (id === 'liberar') {
                    this.LiberarVaga().then(winAt.window("winautorizar").close());
                } else if (id === 'impressao') {
                    this.SolicitarImpressao();
                }

            }.bind(this)
        });

        let combotipoacesso;
        let form = winAt.window("winautorizar").attachForm();
        form.loadStruct(formAutorizacaoAdicao, function () {

            combotipoacesso = form.getCombo('tipo_acesso');
            tiposdeacesso.filter(function (item) {
                combotipoacesso.addOption(item.num, item.descricao);
            });
        });

        form.attachEvent('onKeyUp', function (inp, ev, name) {
            if (name === 'placa' || name === 'nome')
                form.setItemValue(name, form.getItemValue(name).toUpperCase());
        });

        form.enableLiveValidation(true);
        let myPop = new dhtmlXPopup({form: form, id: ["placa"]});

        form.attachEvent('onInputChange', function (name, value) {

            if (name === 'placa' && value.length === 7) {

                let condomino = new Condomino();
                condomino.Pesquisar(value.toUpperCase()).then(response => {

                    let formaviso = myPop.attachForm(formMoradorLocalizado);

                    formaviso.load({data: response});
                    myPop.show('placa');

                    formaviso.attachEvent("onButtonClick", function () {
                        myPop.hide();
                    });

                    form.removeItem('tipo_acesso');
                    form.setFormData({
                        bloco: response.bloco,
                        unidade: response.unidade
                    });
                });
            }
        });

        form.attachEvent("onAfterValidate", function (status) {

            if (!status)
                return;

            winAt.window("winautorizar").progressOn();
            let info = form.getFormData();
            info.inicio = this.inicioautorizacao;
            info.final = window.dhx.date2str(new Date(), '%Y-%m-%d %H:%i:%s');
            info.estacionamento = this.data.estacionamento;
            info.vaga = this.data.numero;
            info.autenticacao = this.Autenticacao;
            info.uidins = window.user.username;

            this._autorizacao = new autorizacao();
            this._autorizacao.veiculo = info;
            this._autorizacao.RegistraDiversoVeiculo().then(response => {

                this.id = response.id;
                this._autorizacao.vaga = {
                    estacionamento: info.estacionamento,
                    numero: info.vaga,
                    autenticacao: info.autenticacao,
                    est_bloco: info.bloco,
                    est_unidade: info.unidade,
                    est_placa: info.placa,
                    est_acesso: info.tipo_acesso,
                    est_entrada: window.dhx.date2str(new Date(), '%Y-%m-%d %H:%i:%s'),
                };

                this.AdicionarPessoas();
                winAt.window("winautorizar").close();
            }).finally(
                winAt.window("winautorizar").progressOff()
            );
        }.bind(this));

    }

    get Autenticacao() {

        /**
         * @return {string}
         */
        function Right(str, n) {
            if (n <= 0)
                return "";
            else if (n > String(str).length)
                return str;
            else {
                let iLen = String(str).length;
                return String(str).substring(iLen, iLen - n);
            }
        }

        let date = new Date();
        let components = [
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ];

        let autenticacao = components.join("");
        return Right(autenticacao, 7);

    }

    LiberarVaga() {
        return new Promise((resolve) => {
            new Vaga().Liberar(this.data.num).then(response => {
                    document.dispatchEvent(new CustomEvent('AoAlterarVaga', {
                        detail: {
                            Vaga: response
                        }
                    }));
                    resolve();
                }
            );
        });
    }

    SolicitarImpressao() {

        let bilhete = new Bilhete();
        bilhete.data = {
            data: this.data.entrada,
            inicio: this.inicioautorizacao,
            final: window.dhx.date2str(new Date(), '%Y-%m-%d %H:%i:%s'),
            est_bloco: this.data.bloco,
            est_unidade: this.data.unidade,
            tipo: this.data.tipo,
            numero: this.data.numero,
            autenticacao: this.data.autenticacao
        };

        bilhete.Imprimir(this.data.tipoacesso, this.data.nomeestacionamento);
    }

    AdicionarPessoas() {

        this.inicio = window.dhx.date2str(new Date(), '%d/%m/%Y %H:%i:%s');

        let winAdd = new dhtmlXWindows({
            image_path: "codebase/imgs/"
        });

        let winat = "winpessoas";

        winAdd.createWindow({
            id: winat,
            width: 730,
            height: 600,
            center: true,
            caption: "Adicionar pessoas"
        });

        winAdd.window(winat).denyMove();
        winAdd.window(winat).denyPark();
        winAdd.window(winat).denyResize();

        let layout = winAdd.window("winpessoas").attachLayout({
            pattern: '2E',
            offsets: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            cells: [
                {
                    id: 'a',
                    header: false,
                    collapse: false,
                    fix_size: [true, true]
                },
                {
                    id: 'b',
                    header: false,
                    height: 200,
                    collapse: false,
                    fix_size: [true, true]
                },
            ]
        });

        let toolbar = winAdd.window("winpessoas").attachToolbar({
            icon_path: 'img/comandos/',
            items: [
                {id: "foto", type: "button", text: "Obter foto", img: "obterfoto.png"},
                {id: "sep1", type: "separator"},
                {id: "salvar", type: "button", text: "Salvar", img: "salvar.png"},
                {id: "finalizar", type: "button", text: "Concluir autorização", img: "finalizar.png", disabled: true}
            ],
            onClick: function (id) {
                switch (id) {
                    case 'foto':
                        this.foto = this.screencast.Image;
                        form.getContainer('instantaneo').innerHTML = '<img alt="" id="instantaneo" src="' + this.foto + '">';
                        break;
                    case 'salvar':
                        form.validate();
                        break;
                    case 'finalizar':
                        this.FinalizaTriagem(winAdd.window("winpessoas"));
                        break;
                    default:
                        break;
                }

            }.bind(this)
        });

        let form = layout.cells('a').attachForm();
        form.loadStruct(formAutorizacaoAdicionarPessoas, function () {
            form.getContainer('container_foto').innerHTML = '<video id="localVideo" autoplay></video>';
            this.screencast = new ScreenCast();
            this.screencast.localvideo = document.getElementById('localVideo');
            this.screencast.Start();
        }.bind(this));

        form.attachEvent('onKeyUp', function (inp, ev, name) {
            if (name === 'nome' || name === 'documento')
                form.setItemValue(name, form.getItemValue(name).toUpperCase());
        });

        form.attachEvent("onAfterValidate", function (status) {

            if (!status)
                return;

            layout.cells('a').progressOn();
            let info = form.getFormData();
            info.foto = this.foto;
            info.autorizacao = this.id;
            info.uidins = window.user.username;
            info.inicio = this.inicio;
            info.final = window.dhx.date2str(new Date(), '%d/%m/%Y %H:%i:%s');

            if (this.grid.doesRowExist(info.documento)) {
                layout.cells('a').progressOff();
                return;
            }

            this._autorizacao.pessoa = info;
            this._autorizacao.RegistraDiversoPessoa().then(response => {
                form.clear();
                this.grid.detachEvent("onCellChanged");
                console.debug(response);
                this.grid.addRow(response.documento, ['<button class="grid-acao" onclick="RemoverRegistroVisitante('+response.documento+','+response.id+');">X</button>', response.id, response.documento, response.nome]);
                toolbar.enableItem('finalizar');
                this.grid.attachEvent("onCellChanged", function (rId, cInd, nValue) {

                    let dados = {documento: nValue};
                    if (cInd === 2)
                        dados = {nome: nValue};

                    this._autorizacao.AtualizaRegistraPessoa(parseInt(this.grid.cells(rId, 0).getValue()), dados);

                }.bind(this));

                this.grid.attachEvent("onKeyPress", function(code,cFlag,sFlag) {

                    if (code === 16)
                        this.code = 16;

                    if (code === 8 && this.code === 16) {
                        this.code = null;
                        console.debug('deletar a linha');

                        let rowId = this.grid.getSelectedRowId();
                        this._autorizacao.RemovePessoa(parseInt(this.grid.cells(rowId, 0).getValue())).then(this.grid.deleteRow(rowId));

                    }

                    console.debug(code,cFlag,sFlag);
                }.bind(this));
            }).finally(() => {
                layout.cells('a').progressOff();
                info = null;
                this.foto = null;
                this.inicio = window.dhx.date2str(new Date(), '%d/%m/%Y %H:%i:%s');

            });
        }.bind(this));

        this.grid = layout.cells('b').attachGrid();
        this.grid.setHeader(',id,Documento,Nome');
        this.grid.setColumnIds("acao,id,documento,nome");
        this.grid.setInitWidths('55,0,200,');
        this.grid.setColTypes('ro,ro,ed,ed');
        this.grid.init();

        gridcorrente = this.grid;

    }

    FinalizaTriagem(wind) {

        this._autorizacao.OcupaVaga().then(response => {

            wind.close();
            document.dispatchEvent(new CustomEvent('AoAlterarVaga', {
                detail: {
                    Vaga: response
                }
            }));

            let bilhete = new Bilhete();
            bilhete.data = response;
            bilhete.data.data = window.dhx.date2str(new Date(), '%d/%m/%Y %H:%i:%s');
            bilhete.data.inicio = this.inicioautorizacao;
            bilhete.data.final = window.dhx.date2str(new Date(), '%Y-%m-%d %H:%i:%s');
            bilhete.Registrar().then(() => {
                bilhete.Imprimir();
            });


        });

    }
}

function RemoverRegistroVisitante(rId, id) {
    new autorizacao().RemovePessoa(id).then(gridcorrente.deleteRow(rId))
}