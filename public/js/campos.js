const formAutorizacaoAdicao = [
    {type: 'settings', labelAlign: 'right', position: 'label-left', inputWidth: 170, offsetTop: 0, labelWidth: 80},
    {type: "block", offsetTop: 10, width:300, list:[
        {type: "input", name: "placa", label: "Placa:", maxLength: 7, labelWidth: 80, validate: "validatePlate", required: true},
    ]},
    {type: "block", width:300, list:[
        {type: "input", name: "bloco", maxLength: 2, validate: "ValidNumeric", label: "Unidade:", required: true, inputWidth: 72},
        {type: "newcolumn", offset: 0},
        {type: "input", name: "unidade", maxLength: 3, validate: "ValidNumeric", label: "-", required: true, labelWidth: 20, inputWidth: 72}
    ]},
    {type: "block", width:300, list:[
        {type: "combo", name: "tipo_acesso", label: "Acesso:", required: true, inputWidth: 170}
    ]}
];

const formAutorizacaoAdicionarPessoas = [
    {type: 'settings', labelAlign: 'right', position: 'label-left', inputWidth: 170, offsetTop: 0, labelWidth: 80},
    {type: "block", offsetTop: 10, width:300, list:[
        {type: "input", name: "nome", label: "Nome:", required: true},
    ]},
    {type: "block", width:300, list:[
        {type: "input", name: "documento", label: "Documento:", required: true, validate: "validateDOC"},
        {type:"container", name:"instantaneo", inputWidth:100, inputHeight:100}
    ]},
    {type: "newcolumn", offset: 0},
    {type:"container", name:"container_foto", inputWidth:330, inputHeight:200}
];

const formAutorizacaoMorador = [
    {type: 'settings', labelAlign: 'right', position: 'label-left', inputWidth: 170, labelWidth: 70, offsetLeft: 0, offsetTop: 5},
    {type: "block", width:300, list:[
        {type: "input", name: "placa", label: "Placa:", maxLength: 7, validate: "validatePlate", required: true}
    ]},
    {type: "block", width:300, list:[
        {type: "input", name: "nome", label: "Nome:", required: true, validate: "validateName"}
    ]},
    {type: "block", width:300, list:[
        {type: "input", name: "bloco", maxLength: 2, validate: "ValidNumeric", label: "Torre:", required: true, inputWidth:50},
        {type: "newcolumn", offset: 0},
        {type: "input", name: "unidade", maxLength: 3, validate: "ValidNumeric",label: "Unidade:", required: true, inputWidth:50}
    ]}
];

const formAutorizacaoServicos = [
    {type: 'settings', labelAlign: 'right', position: 'label-left', inputWidth: 170, labelWidth: 70, offsetLeft: 0, offsetTop: 5},
    {type: "block", width:300, list:[
        {type: "input", name: "placa", label: "Placa:", maxLength: 7, validate: "validatePlate", required: true}
    ]},
    {type: "block", width:300, list:[
        {type: "input", name: "nome", label: "Nome:", required: true}
    ]},
    {type: "block", width:300, list:[
        {type: "input", name: "bloco", maxLength: 2, validate: "ValidNumeric", label: "Torre:", required: true, inputWidth:50},
        {type: "newcolumn", offset: 0},
        {type: "input", name: "unidade", maxLength: 3, validate: "ValidNumeric",label: "Unidade:", required: true, inputWidth:50}
    ]}
];

const formMoradorLocalizado = [
    {type: 'settings', labelAlign: 'right', position: 'label-left', inputWidth: 150, labelWidth: 100, offsetLeft: 0, offsetTop: 0},
    {type: "template", value: "Veículo cadastrado no seguinte local", offsetTop: 0, inputWidth: 250, style: "font-weight:bold; color: red; margin-top: 5px;"},
    {type: "template", name: "bloco", label: "Bloco:", offsetTop: 0, style: "font-weight:bold; margin-top: 5px;"},
    {type: "template", name: "unidade", label: "Unidade:", offsetTop: 0, style: "font-weight:bold; margin-top: 5px;"},
    {type: "template", name: "nome", label: "Nome:", offsetTop: 0, style: "font-weight:bold; margin-top: 5px;"},
    {type: "template", name: "marca", label: "Marca:", offsetTop: 0, style: "font-weight:bold; margin-top: 5px;"},
    {type: "template", name: "modelo", label: "Modelo:", offsetTop: 0, style: "font-weight:bold; margin-top: 5px;"},
    {type: "template", name: "cor", label: "Cor:", offsetTop: 0, style: "font-weight:bold; margin-top: 5px;"},
    {type: "template", name: "datacadastro", label: "Cadastrado em:", offsetTop: 0, style: "font-weight:bold; margin-top: 5px;"}
];

const barradeComandosRapidos = [
    {
        id:'autoriza-condominos',
        innerText: 'Condôminos',
        campos: formAutorizacaoMorador,
        img: 'img/expresso/condominos.png',
        endpoint: '/triagem/autorizacao_condomino?select=id'
    },
    {
        id:'autoriza-assistencias',
        innerText: 'Socorro Mecânico',
        campos: formAutorizacaoServicos,
        img: 'img/expresso/socorro_mecanico.png',
        print: true,
        endpoint: '/triagem/autorizacao_servicos?select=id'
    },
    {
        id:'autoriza-escolar',
        innerText: 'Transporte escolar',
        img: 'img/expresso/transporte_escolar.png',
        data:{
            tipo_acesso: 13
        },
        endpoint: '/triagem/autorizacao_expressa?select=id'
    },
    {
        id:'autoriza-entregas',
        innerText: 'Correspondência',
        img: 'img/expresso/correspondencia.png',
        campos: formAutorizacaoServicos,
        print: true,
        endpoint: '/triagem/autorizacao_servicos?select=id'
    },
    {
        id:'autoriza-emergencia',
        innerText: 'Emergência',
        img: 'img/expresso/emergencias.png',
        data:{
            tipo_acesso: 14
        },
        endpoint: '/triagem/autorizacao_expressa?select=id'
    }
];