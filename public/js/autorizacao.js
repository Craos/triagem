class autorizacao {

    RegistrarComForm() {

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

        form.attachEvent("onAfterValidate", function (status) {

            if (!status)
                return;

            let data = form.getFormData();
            data.uidins = 'oberdan';

            $.ajax({
                type: "POST",
                url: this.comando.endpoint,
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

        $.ajax({
            type: "POST",
            url: this.comando.endpoint,
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
                url: 'http://anima.craos.net/triagem/autorizacao_diversos',
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
                url: 'http://anima.craos.net/triagem/autorizacao_pessoas?select=id,documento,nome',
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

    OcupaVaga() {
        return new Promise(((resolve, reject) => {
            $.ajax({
                type: "PATCH",
                url: 'http://anima.craos.net/triagem/vagas?numero=eq.' + this.vaga.numero,
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