import './bootstrap.css';
import './style.css';

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

    this.salvaTemp = document.querySelector("#salva-temp");
    this.salvaTemp.addEventListener('click', this.salvaLocal.bind(this));

    this.carregaTemp = document.querySelector("#carrega-temp");
    this.carregaTemp.addEventListener('click', this.carregarLocal.bind(this));

    this.limpaTemp = document.querySelector("#limpa-temp");
    this.limpaTemp.addEventListener('click', this.limpar.bind(this));

    this.velha = document.querySelector("#velha");
    this.velha.addEventListener("click", event => {
      this.realizaJogada(event);
      this.render();
    });

    this.navbarToggler = document.querySelector('.navbar-toggler');
    this.navbarCollapse = document.querySelector('.navbar-collapse');
    

    this.navbarToggler.addEventListener('click', () => {
      this.navbarCollapse.classList.toggle('collapse');
    });

  }

  limpar(){
    localStorage.setItem('jogo', '');
    this.iniciaEstado();
    this.render();
  }

  carregarLocal(){
    try {
      this.jogadas = JSON.parse(localStorage.getItem('jogo'));
      this.messages.push("This was your last saved game");
    } catch (error) {
      this.messages.push("There is no previous game");
    }
    
    this.render();
  }

  salvaLocal(){

    const jogadorX = document.querySelector("#jogadorX");
    const jogadorO = document.querySelector("#jogadorO");

    localStorage.setItem('jogo', JSON.stringify(this.jogadas));
  }

  realizaJogada(event) {
    const id = event.target.dataset.id;

    // verifica se a partida terminou
    if (this.fim) {
      this.messages.push("The game has endend");
      return;
    }

    // verifica se escolheu uma casa correta
    if (!event.target.dataset.id) {
      this.messages.push("You need o choose a square!");
      return;
    }

    // verifica se a posição é válida
    if (this.jogadas[id] != 0) {
      this.messages.push("This position is invalid");
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
      
      this.messages.push(`Player ${resultado} wins!`);
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
