// URL da planilha exportada como CSV
const planilhaCSV = 'https://docs.google.com/spreadsheets/d/1KKIUVdIm92fmUYLCzX1ujMwhwS35JhAk1jewuHa4RsA/export?format=csv';

// Lista de itens com preços
const itens = [
    { nome: "Adesivo", preco: 200 },
    { nome: "Chaveiro Personalizado", preco: 250 },
    { nome: "Caixa de Bombom", preco: 350 },
    { nome: "Quadro Gamer", preco: 500 },
    { nome: "Impressão 3D personalizada", preco: 700 },
    { nome: "Mouse Pad Ctrl Play", preco: 800 },
    { nome: "Mochila", preco: 1000 },
    { nome: "GiftCard", preco: 1500 },
    { nome: "Kit Arduino", preco: 2000 },
    { nome: "Funko Pop", preco: 3000 },
];

// Função para buscar e processar dados da planilha CSV
async function obterDadosDaPlanilha() {
    try {
        console.log("Buscando dados da planilha...");
        const response = await fetch(planilhaCSV);

        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const csvData = await response.text();
        console.log("Dados recebidos da planilha:", csvData);

        const linhas = csvData.split('\n');
        const alunos = {};

        // Ignora a primeira linha (cabeçalho) e processa as demais
        for (let i = 1; i < linhas.length; i++) {
            const [nome, moedas] = linhas[i].split(',');

            if (nome && moedas) {
                alunos[nome.trim().toLowerCase()] = parseInt(moedas, 10);
            }
        }
        console.log("Dados processados:", alunos);
        return alunos;
    } catch (error) {
        console.error("Erro ao buscar dados da planilha:", error);
        return null;
    }
}

// Função para consultar moedas de um aluno
async function consultarMoedas() {
    const nome = document.getElementById('input-nome').value.trim().toLowerCase();
    const resultado = document.getElementById('resultado');
    const itensDisponiveis = document.getElementById("itens-disponiveis");
    const listaItens = document.getElementById("lista-itens");

    resultado.textContent = "Consultando...";
    itensDisponiveis.style.display = "none";

    const alunos = await obterDadosDaPlanilha();

    if (alunos) {
        if (alunos[nome] !== undefined) {
            const moedas = alunos[nome];
            resultado.textContent = `O aluno ${nome} possui ${moedas} CtrlCash.`;

            // Limpa a lista de itens disponíveis
            listaItens.innerHTML = "";

            // Adiciona os itens que o aluno pode pegar
            let possuiItens = false;
            itens.forEach(item => {
                if (moedas >= item.preco) {
                    possuiItens = true;

                    // Cria um item na lista
                    const li = document.createElement("li");
                    li.textContent = `${item.nome} - ${item.preco} CtrlCash`;

                    // Botão de WhatsApp
                    const btn = document.createElement("button");
                    btn.textContent = "Pedir pelo WhatsApp";
                    btn.onclick = () => enviarWhatsApp(nome, item.nome);

                    // Adiciona o botão ao item
                    li.appendChild(btn);
                    listaItens.appendChild(li);
                }
            });

            if (!possuiItens) {
                listaItens.innerHTML = "<li>Nenhum item disponível para troca.</li>";
            }

            // Mostra a seção de itens disponíveis
            itensDisponiveis.style.display = "block";
        } else {
            resultado.textContent = "Aluno não encontrado. Verifique o nome digitado.";
        }
    } else {
        resultado.textContent = "Erro ao carregar os dados. Tente novamente mais tarde.";
    }
}

// Função para enviar mensagem no WhatsApp
function enviarWhatsApp(nome, item) {
    const telefone = "5522992360070"; // Substitua pelo número do WhatsApp desejado
    const mensagem = `Olá, meu nome é ${nome}. Gostaria de trocar minhas CtrlCash pelo item: ${item}.`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}
