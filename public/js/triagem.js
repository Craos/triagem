class Triagem {

    Iniciar() {

        let winAt = new dhtmlXWindows({
            image_path: "codebase/imgs/"
        });

        let winat = "winautorizar";

        winAt.createWindow({
            id: winat,
            width: 310,
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
                {id: "liberar", type: "button", text: "Liberar a vaga", img: "liberar.png"}
            ],
            onClick: function (id) {
                if (id === 'salvar') {
                    form.validate();
                } else if (id === 'liberar') {
                    new Vaga().Liberar(this.data.num).then(response => {
                            winAt.window("winautorizar").close();
                            document.dispatchEvent(new CustomEvent('AoAlterarVaga', {
                                detail: {
                                    Vaga: response
                                }
                            }))
                        }
                    );
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
            info.estacionamento = this.data.estacionamento;
            info.vaga = this.data.numero;
            info.autenticacao = this.Autenticacao;
            info.uidins = 'oberdan';

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

    AdicionarPessoas() {

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
            info.uidins = 'oberdan';

            this._autorizacao.pessoa = info;
            this._autorizacao.RegistraDiversoPessoa().then(response => {
                form.clear();
                this.grid.addRow(this.grid.uid(), [response.id, response.documento, response.nome]);
                toolbar.enableItem('finalizar');
            }).finally(
                layout.cells('a').progressOff()
            );
        }.bind(this));

        this.grid = layout.cells('b').attachGrid();
        this.grid.setHeader('id,Documento,Nome');
        this.grid.setInitWidths('0,200,');
        this.grid.setColTypes('ro,ro,ro');
        this.grid.setColSorting('str,str,str');
        this.grid.init();

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
            console.debug(bilhete.data);
            bilhete.Imprimir();
        });

    }
}