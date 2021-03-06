class autorizacao {

    RegistrarComForm() {

        this.inicio = window.dhx.date2str(new Date(), '%Y-%m-%d %H:%i:%s');

        let winAt = new dhtmlXWindows({
            image_path: "codebase/imgs/"
        });

        let winat = "winautorizar";

        winAt.createWindow({
            id: winat,
            width: 330,
            height: 230,
            center: true,
            caption: "Registro de autorização"
        });

        winAt.window(winat).denyMove();
        winAt.window(winat).denyPark();
        winAt.window(winat).denyResize();

        winAt.window("winautorizar").attachToolbar({
            icon_path: 'img/comandos/',
            items: [
                {id: "salvar", type: "button", text: "Salvar", img: "salvar.png"}
            ],
            onClick: function () {
                form.validate();
            }
        });

        let form = winAt.window("winautorizar").attachForm(this.comando.campos);

        form.attachEvent('onKeyUp', function (inp, ev, name) {
            if (name === 'placa' || name === 'nome')
                form.setItemValue(name, form.getItemValue(name).toUpperCase());
        });

        form.attachEvent("onAfterValidate", function (status) {

            if (!status)
                return;

            let data = form.getFormData();
            data.uidins = window.user.username;
            data.inicio = this.inicio;
            data.final = window.dhx.date2str(new Date(), '%Y-%m-%d %H:%i:%s');

            $.ajax({
                type: "POST",
                url: window.config.endpoint + this.comando.endpoint,
                dataType: "json",
                headers: {
                    Prefer: "return=representation",
                    Accept: "application/vnd.pgrst.object+json"
                },
                success: function () {

                    winAt.window("winautorizar").close();
                    dhtmlx.alert({
                        title: 'Autorização',
                        type: 'alert',
                        text: 'Registrado com sucesso!'
                    });
                },
                data: data
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: jqXHR.responseJSON.message
                });
            });

        }.bind(this));

    }

    RegistrarExpresso() {

        this.comando.data.uidins = window.user.username;

        $.ajax({
            type: "POST",
            url: window.config.endpoint + this.comando.endpoint,
            dataType: "json",
            headers: {
                Prefer: "return=representation",
                Accept: "application/vnd.pgrst.object+json"
            },
            success: function () {

                dhtmlx.alert({
                    title: 'Autorização',
                    type: 'alert',
                    text: 'Registrado com sucesso!'
                });

            },
            data: this.comando.data
        }).fail(function (jqXHR) {
            dhtmlx.alert({
                title: 'Atenção',
                type: 'alert-error',
                text: jqXHR.responseJSON.message
            });
        });
    }

    RegistraDiversoVeiculo() {

        return new Promise((resolve, reject) => {

            $.ajax({
                type: "POST",
                url: window.config.endpoint + '/triagem/autorizacao_diversos',
                dataType: "json",
                headers: {
                    Prefer: "return=representation",
                    Accept: "application/vnd.pgrst.object+json"
                },
                success: function (response) {
                    resolve(response);
                },
                data: this.veiculo
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

    RegistraDiversoPessoa() {

        return new Promise((resolve, reject) => {

            $.ajax({
                type: "POST",
                url: window.config.endpoint + '/triagem/autorizacao_pessoas?select=id,documento,nome',
                dataType: "json",
                headers: {
                    Prefer: "return=representation",
                    Accept: "application/vnd.pgrst.object+json"
                },
                success: function (response) {
                    resolve(response);
                },
                data: this.pessoa
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

    AtualizaRegistraPessoa(id, dados) {

        return new Promise((resolve, reject) => {

            $.ajax({
                type: "PATCH",
                url: window.config.endpoint + '/triagem/autorizacao_pessoas?id=eq.'+id+'&select=id',
                dataType: "json",
                headers: {
                    Prefer: "return=representation",
                    Accept: "application/vnd.pgrst.object+json"
                },
                success: function (response) {
                    resolve(response);
                },
                data: dados
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

    RemovePessoa(id) {

        return new Promise((resolve, reject) => {

            $.ajax({
                type: "DELETE",
                url: window.config.endpoint + '/triagem/autorizacao_pessoas?id=eq.'+id,
                dataType: "json",
                headers: {
                    Prefer: "return=representation",
                    Accept: "application/vnd.pgrst.object+json"
                },
                success: function (response) {
                    resolve(response);
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



    OcupaVaga() {
        return new Promise(((resolve, reject) => {
            $.ajax({
                type: "PATCH",
                url: window.config.endpoint + '/triagem/vagas?numero=eq.' + this.vaga.numero,
                dataType: "json",
                headers: {
                    Prefer: "return=representation",
                    Accept: "application/vnd.pgrst.object+json"
                },
                success: function (response) {
                    resolve(response);
                },
                data: this.vaga
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