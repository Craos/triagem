let tiposdeacesso, listaestacionamentos;
let layoutprincipal, siderbar, user;

let App = function () {

    this.start = function() {

        layoutprincipal = new dhtmlXLayoutObject({
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

        siderbar = layoutprincipal.cells('a').attachSidebar({
            template: 'icons',
            icons_path: 'img/siderbar/',
            single_cell: false,
            width: 50,
            header: false,
            autohide: false,
            items: [
                {
                    id: 'dashboard',
                    text: 'Dashboard',
                    icon: 'dashboard.png',
                    selected: false
                },
                {
                    id: 'estacionamento',
                    text: 'Estacionamento',
                    icon: 'estacionamento.png',
                    selected: true
                },
                {
                    id: 'portaria',
                    text: 'Portaria',
                    icon: 'portaria.png',
                    selected: false
                },
                {
                    id: 'config',
                    text: 'Configurações',
                    icon: 'configuracoes.png',
                    selected: false
                }
            ]
        });

        siderbar.attachEvent('onSelect', function (id) {

            let cell = siderbar.cells(id);
            layoutprincipal.cells('a').setText(siderbar.cells(id).getText().text);

            if (id === 'dashboard') {

            } else if (id === 'config') {

            } else if (id === 'estacionamento') {

            } else if (id === 'portaria') {

            }

        });

        new ControleEstacionamento();

        this.header();

    };

    this.header = function() {

        let logo = document.createElement('div');
        logo.className = 'app-header-user-logo';

        let avatar = document.createElement('div');
        avatar.className = 'app-header-user-avatar';

        let img = document.createElement('img');
        img.className = 'app-header-user-avatar-img';
        img.src = window.user.userinfo.avatar;

        avatar.appendChild(img);

        let header = document.getElementsByClassName('dhx_cell_hdr')[0];
        header.innerHTML = '';
        header.className = 'app-header';
        header.appendChild(logo);
        header.appendChild(avatar);
    };

    this.start();


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