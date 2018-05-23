window.onload = () => {
  window.app = new JogoVelha();
};

class JogoVelha {
  constructor() {
    
    this.iniciaEstado();
    this.iniciaElementos();
  }

  iniciaEstado(){
    this.vitoria = [448, 56, 7, 292, 146, 73, 273, 84];
    this.jogadas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.turno = true;
    this.fim = false;
    this.messages = [];
  }
  iniciaElementos() {

    this.jogadorX = document.querySelector("#jogadorX");
    this.jogadorO = document.querySelector("#jogadorO");

    this.salvaTemp = document.querySelector("#salva-temp");
    this.salvaTemp.addEventListener('click', this.salvaLocal.bind(this));

    this.carregaTemp = document.querySelector("#carrega-temp");
    this.carregaTemp.addEventListener('click', this.carregarLocal.bind(this));

    this.limpaTemp = document.querySelector("#limpa-temp");
    this.limpaTemp.addEventListener('click', this.limpar.bind(this));

    // this.salvar = document.querySelector("#salvar");
    // this.salvar.addEventListener("click", this.enviaServidor.bind(this));

    this.velha = document.querySelector("#velha");
    this.velha.addEventListener("click", event => {
      this.realizaJogada(event);
      this.render();
    });

  }

  limpar(){
    localStorage.setItem('jogo', '');
    this.iniciaEstado();
    this.jogadorO.value = '';
    this.jogadorX.value = '';
    this.render();
  }

  carregarLocal(){
    const dados = JSON.parse(localStorage.getItem('jogo'));
    this.jogadas = dados.jogo;
    this.jogadorO.value = dados.jogadorO;
    this.jogadorX.value = dados.jogadorX;

    this.render();

  }

  salvaLocal(){

    const jogadorX = document.querySelector("#jogadorX");
    const jogadorO = document.querySelector("#jogadorO");

    const dados = {jogadorX: jogadorX.value, jogadorO: jogadorO.value, jogo: this.jogadas};

    localStorage.setItem('jogo', JSON.stringify(dados));
  }

  realizaJogada(event) {
    const id = event.target.dataset.id;

    // verifica se a partida terminou
    if (this.fim) {
      this.messages.push("Partida terminada");
      return;
    }

    // verifica se escolheu uma casa correta
    if (!event.target.dataset.id) {
      this.messages.push("Você precisa clicar em uma casa");
      return;
    }

    // verifica se a posição é válida
    if (this.jogadas[id] != 0) {
      this.messages.push("Esta posição já foi escolhida");
      return;
    }

    //salva a jogada
    this.jogadas[id] = this.turno ? 'X' : 'O';

    // troca o turno
    this.turno = !this.turno;
  }

  render() {

    //verifica se houve algum vencedor, encerrando o jogo caso sim
    const resultado = this.verificaVencedor();
    if (resultado == 'X' || resultado == 'O') {
      this.fim = true;
      
      this.messages.push(`O jogador ${resultado} venceu!`);
    }

    //renderiza as jogadas no tabuleiro
    const velhaElement = document.querySelectorAll("[data-id]");
    for (let i = 0; i < 9; i++) {
      velhaElement[i].innerHTML = this.jogadas[i] == 0 ? "" : this.jogadas[i];
    }

    // imprime mensagens
    while (this.messages.length) {
      this.modal(this.messages.pop());
    }

  }

  modal(valor) {
    const modais = document.querySelector("#modais");
    const texto = document.createElement("div");
    texto.classList.add("modalClass");
    texto.innerHTML = valor;

    modais.appendChild(texto);

    setTimeout(() => {
      texto.classList.add("removed");
      setTimeout(() => {
        modais.removeChild(texto);
      }, 1000);
    }, 2000);
  }

  verificaVencedor() {
    const jogadorX = parseInt(
      this.jogadas.map(value => (value == 'X' ? 1 : 0)).join(''),
      2
    );
    const jogadorY = parseInt(
      this.jogadas.map(value => (value == 'O' ? 1 : 0)).join(''),
      2
    );

    for (const element of this.vitoria) {
      if ((element & jogadorX) == element) {
        return 'X';
      }
      if ((element & jogadorY) == element) {
        return 'O';
      }
    }

    return "";
  }


}
