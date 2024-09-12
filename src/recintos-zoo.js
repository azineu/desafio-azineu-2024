  const zoo = [
    {numero: 1, bioma: ["savana"], tamanho: 10,animais: [{animal: "macaco",total: 3,},],},
    {numero: 2,bioma: ["floresta"],tamanho: 5,animais: [],},
    {numero: 3,bioma: ["savana", "rio"],tamanho: 7,animais: [{animal: "gazela",total: 1,},],},
    {numero: 4,bioma: ["rio"],tamanho: 8,animais: [],},
    {numero: 5,bioma: ["savana"],tamanho: 9,animais: [{animal: "leao",total: 1,},],},];
  
  const animais = [
    { animal: "LEAO", tamanho: 3, bioma: ["savana"], carnivoro: true },
    { animal: "LEOPARDO", tamanho: 2, bioma: ["savana"], carnivoro: true },
    { animal: "CROCODILO", tamanho: 3, bioma: ["rio"], carnivoro: true },
    {animal: "MACACO",tamanho: 1,bioma: ["savana", "floresta"],precisCompanhia: true,},
    { animal: "GAZELA", tamanho: 2, bioma: ["savana"] },
    {animal: "HIPOPOTAMO",tamanho: 4,bioma: ["savana", "rio"],biomaExato: true,},];
  
  class RecintosZoo {
    obtemInfoAnimal(animal) {
      return animal && animais.find((a) => a.animal === animal.toUpperCase());
    }
  
    obtemEspacoOcupado(espaco) {
      let total = 0;
      espaco.animais.forEach((a) => {
        const animalInfo = animais.find((o) => o.animal.toUpperCase() === a.animal.toUpperCase());
        total += animalInfo.tamanho * a.total;});
    return total;
    }
  
    contemAnimalDiferente(espaco, animal) {
      return !!espaco.animais.find(
        (a) => a.animal.toUpperCase() !== animal.toUpperCase());
    }
  
    biomaValido(biomaEspaco, biomaAnimal) {
      return !!biomaAnimal.find((bioma) => biomaEspaco.includes(bioma));
    }
  
    biomaExatoValido(biomaEspaco, biomaAnimal) {
      if (biomaEspaco.length !== biomaAnimal.length) {
        return false;}
  
      for (let i = 0; i < biomaEspaco.length; ++i) {
        if (biomaEspaco[i] !== biomaAnimal[i]) {
          return false;
        }
      }
      return true;
    }
  
    gerarMensagemSucesso(numero, livre, total) {
      return `Recinto ${numero} (espaço livre: ${livre} total: ${total})`;
    }
  
    gerarMensagemErro(mensagem) {
      const erro = {erro: mensagem,};
      
      console.log(JSON.stringify(erro, null, 2));
  
      return erro;
    }
  
    animaisCompativeis(animaisEspaco, novoAnimal, biomaEspaco) {
      return !animaisEspaco.some((a) => {
        const animalEspaco = this.obtemInfoAnimal(a.animal);
  
        if (animalEspaco.animal === novoAnimal.animal) {
          return false;
        }
  
        if (
          (animalEspaco.carnivoro || novoAnimal.carnivoro) &&
          animalEspaco.animal.toUpperCase() !== novoAnimal.animal.toUpperCase()
        ) {
          return true;
        }
  
        if (
          (animalEspaco.biomaExato || novoAnimal.biomaExato) &&
          !this.biomaExatoValido(biomaEspaco, animalEspaco.bioma)
        ) {
          return true;
        }
  
        return false;
      });
    }
  
    obtemRecintos(infoAnimal, quantidade) {
      return zoo
        .map((espaco) => {
          const espacoOcupado = this.obtemEspacoOcupado(espaco);
          const espacoExtra = this.contemAnimalDiferente(
            espaco,
            infoAnimal.animal
          )
            ? 1
            : 0;
          const espacoLivre = espaco.tamanho - espacoOcupado - espacoExtra;
          const espacoLivreAnimais =
            espacoLivre >= infoAnimal.tamanho * quantidade;
          const novoEspacoLivre = espacoLivre - infoAnimal.tamanho * quantidade;
  
          if (!espacoLivreAnimais) {
            return false;
          }
  
          const mensagemSucesso = this.gerarMensagemSucesso(
            espaco.numero,
            novoEspacoLivre,
            espaco.tamanho
          );
  
          if (!espaco.animais.length) {
            if (
              this.biomaValido(espaco.bioma, infoAnimal.bioma) &&
              (!infoAnimal.precisCompanhia || quantidade > 1)
            ) {
              return mensagemSucesso;
            }
  
            return false;
          }
  
          if (
            this.biomaValido(espaco.bioma, infoAnimal.bioma) &&
            this.animaisCompativeis(espaco.animais, infoAnimal, espaco.bioma)
          ) {
            return mensagemSucesso;
          }
  
          return false;
        })
        .filter(Boolean);
    }
  
    analisaRecintos(animal, quantidade) {
      const infoAnimal = this.obtemInfoAnimal(animal);
  
      if (!infoAnimal) {
        return this.gerarMensagemErro("Animal inválido");
      }
  
      if (!quantidade || Number(quantidade) === NaN) {
        return this.gerarMensagemErro("Quantidade inválida");
      }
  
      const recintosViaveis = this.obtemRecintos(infoAnimal, quantidade);
  
      if (!recintosViaveis || !recintosViaveis.length) {
        return this.gerarMensagemErro("Não há recinto viável");
      }
  
      console.log(JSON.stringify(recintosViaveis, null, 2));
  
      return {
        recintosViaveis,
      };
    }
  }
  
  export { RecintosZoo as RecintosZoo };

