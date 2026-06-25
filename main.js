// main.js - Dark Academia Version Personalizado
(function() {
  "use strict";

  // Elementos
  const campoSenha = document.getElementById('campo-senha');
  const tamanhoTexto = document.getElementById('tamanho-texto');
  const btnInc = document.getElementById('btn-inc');
  const btnDec = document.getElementById('btn-dec');
  const btnGerar = document.getElementById('btn-gerar');
  const btnCopiar = document.getElementById('btn-copiar');

  const chkMaius = document.getElementById('chk-maius');
  const chkMinus = document.getElementById('chk-minus');
  const chkNum = document.getElementById('chk-num');
  const chkSimb = document.getElementById('chk-simb');
  const chkEspeciais = document.getElementById('chk-especiais');
  const chkSemAmbiguos = document.getElementById('chk-sem-ambiguos');
  const forcaBar = document.getElementById('forca-bar');
  const entropiaTexto = document.getElementById('entropia-texto');

  // Conjuntos de caracteres
  const LETRAS_MAIUSCULAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LETRAS_MINUSCULAS = 'abcdefghijklmnopqrstuvwxyz';
  const NUMEROS = '0123456789';
  const SIMBOLOS = '!@#$%*?&+-=';
  const CARACTERES_ESPECIAIS = '()[]{}<>;:,._~|/';
  const AMBIGUOS = '0OIl1|';

  // Estado
  let tamanhoSenha = 12;
  let senhaAtual = '';

  // Atualiza o display do tamanho
  function atualizarTamanhoDisplay() {
    tamanhoTexto.textContent = tamanhoSenha;
  }

  // Ativa/desativa botão gerar
  function atualizarBotaoGerar() {
    btnGerar.disabled = tamanhoSenha < 6;
  }

  // Remove caracteres ambíguos
  function removerAmbiguos(conjunto) {
    let resultado = '';
    for (let i = 0; i < conjunto.length; i++) {
      if (!AMBIGUOS.includes(conjunto[i])) {
        resultado += conjunto[i];
      }
    }
    return resultado;
  }

  function pegarCaractereAleatorio(conjunto) {
    if (conjunto.length === 0) return '';
    const indice = Math.floor(Math.random() * conjunto.length);
    return conjunto[indice];
  }

  function embaralharString(str) {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  // Gera a senha
  function gerarSenha() {
    let conjuntos = [];

    if (chkMaius.checked) {
      let conjunto = LETRAS_MAIUSCULAS;
      if (chkSemAmbiguos.checked) conjunto = removerAmbiguos(conjunto);
      if (conjunto.length > 0) conjuntos.push(conjunto);
    }

    if (chkMinus.checked) {
      let conjunto = LETRAS_MINUSCULAS;
      if (chkSemAmbiguos.checked) conjunto = removerAmbiguos(conjunto);
      if (conjunto.length > 0) conjuntos.push(conjunto);
    }

    if (chkNum.checked) {
      let conjunto = NUMEROS;
      if (chkSemAmbiguos.checked) conjunto = removerAmbiguos(conjunto);
      if (conjunto.length > 0) conjuntos.push(conjunto);
    }

    if (chkSimb.checked) {
      let conjunto = SIMBOLOS;
      if (chkSemAmbiguos.checked) conjunto = removerAmbiguos(conjunto);
      if (conjunto.length > 0) conjuntos.push(conjunto);
    }

    if (chkEspeciais.checked) {
      let conjunto = CARACTERES_ESPECIAIS;
      if (chkSemAmbiguos.checked) conjunto = removerAmbiguos(conjunto);
      if (conjunto.length > 0) conjuntos.push(conjunto);
    }

    if (conjuntos.length === 0) {
      let conjunto = LETRAS_MAIUSCULAS;
      if (chkSemAmbiguos.checked) conjunto = removerAmbiguos(conjunto);
      conjuntos.push(conjunto);
      chkMaius.checked = true;
    }

    let alfabetoCompleto = '';
    for (let conjunto of conjuntos) {
      alfabetoCompleto += conjunto;
    }
    alfabetoCompleto = [...new Set(alfabetoCompleto)].join('');

    let senha = '';
    let comprimento = tamanhoSenha;

    if (comprimento < conjuntos.length) {
      comprimento = conjuntos.length;
    }

    for (let i = 0; i < conjuntos.length; i++) {
      let char = pegarCaractereAleatorio(conjuntos[i]);
      senha += char;
    }

    for (let i = conjuntos.length; i < comprimento; i++) {
      let char = pegarCaractereAleatorio(alfabetoCompleto);
      senha += char;
    }

    senha = embaralharString(senha);

    if (senha.length > tamanhoSenha) {
      senha = senha.substring(0, tamanhoSenha);
    }

    while (senha.length < tamanhoSenha) {
      senha += pegarCaractereAleatorio(alfabetoCompleto);
    }

    senhaAtual = senha;
    campoSenha.value = senha;

    const tamanhoAlfabeto = alfabetoCompleto.length;
    const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    classificarForca(entropia);
    atualizarEntropiaTexto(entropia);
  }

  // Classifica a força
  function classificarForca(entropia) {
    forcaBar.classList.remove('fraca', 'media', 'forte');

    let largura = 0;

    if (entropia > 57) {
      largura = 100;
      forcaBar.classList.add('forte');
    } else if (entropia > 35 && entropia <= 57) {
      largura = 50;
      forcaBar.classList.add('media');
    } else {
      largura = 25;
      forcaBar.classList.add('fraca');
    }

    forcaBar.style.width = largura + '%';
  }

  // Atualiza texto de entropia
  function atualizarEntropiaTexto(entropia) {
    const tentativasPorSegundo = 100e6;
    const segundosPorDia = 60 * 60 * 24;
    const dias = Math.floor(Math.pow(2, entropia) / (tentativasPorSegundo * segundosPorDia));

    let msg = '';
    if (dias < 1) {
      msg = '⏱️ Esta senha pode ser desvendada em menos de 1 dia.';
    } else if (dias < 30) {
      msg = `⏳ Um computador pode levar ${dias} dias para desvendar essa senha.`;
    } else if (dias < 365) {
      const meses = Math.floor(dias / 30);
      msg = `📅 Um computador pode levar cerca de ${meses} meses para desvendar essa senha.`;
    } else if (dias < 36500) {
      const anos = Math.floor(dias / 365);
      msg = `📆 Um computador pode levar cerca de ${anos} anos para desvendar essa senha.`;
    } else {
      msg = `🌌 Um computador pode levar mais de ${Math.floor(dias/365)} anos para desvendar essa senha.`;
    }
    entropiaTexto.textContent = msg;
  }

  // Funções de incremento/decremento
  function aumentarTamanho() {
    if (tamanhoSenha < 20) {
      tamanhoSenha++;
      atualizarTamanhoDisplay();
      atualizarBotaoGerar();
      gerarSenha();
    }
  }

  function diminuirTamanho() {
    if (tamanhoSenha > 1) {
      tamanhoSenha--;
      atualizarTamanhoDisplay();
      atualizarBotaoGerar();
      gerarSenha();
    }
  }

  // Copiar senha
  function copiarSenha() {
    if (!senhaAtual) return;
    navigator.clipboard.writeText(senhaAtual).then(() => {
      btnCopiar.innerHTML = '✅';
      setTimeout(() => {
        btnCopiar.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>`;
      }, 1500);
    }).catch(() => {
      campoSenha.select();
      document.execCommand('copy');
      btnCopiar.innerHTML = '✅';
      setTimeout(() => {
        btnCopiar.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>`;
      }, 1500);
    });
  }

  // Event listeners
  btnInc.addEventListener('click', aumentarTamanho);
  btnDec.addEventListener('click', diminuirTamanho);

  [chkMaius, chkMinus, chkNum, chkSimb, chkEspeciais, chkSemAmbiguos].forEach(chk => {
    chk.addEventListener('change', gerarSenha);
  });

  btnGerar.addEventListener('click', gerarSenha);
  btnCopiar.addEventListener('click', copiarSenha);

  // Inicialização
  function init() {
    tamanhoSenha = 12;
    atualizarTamanhoDisplay();
    atualizarBotaoGerar();
    chkMaius.checked = true;
    chkMinus.checked = false;
    chkNum.checked = false;
    chkSimb.checked = false;
    chkEspeciais.checked = false;
    chkSemAmbiguos.checked = false;
    gerarSenha();
  }

  init();

  window.gerarSenha = gerarSenha;
})();