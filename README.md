# Desafio Guide

Esse projeto foi criado com [Angular CLI](https://github.com/angular/angular-cli) versão 15.2.2.

## Instruções para iniciar o projeto e acessa-lo

Para iniciar o projeto execute o seguinte comando `npm start`. Para acessar a aplicação, abra o seguinte link `http://localhost:4200/`.

## Observações

Foi necessário utilizar a ferramenta 'alloworigins.win', pois o Yahoo Finance possui regras de segurança que impedem a API de ser acessada de forma externa (CORS).

Nas instruções do desafio é solicitado que seja feita a ligação entre o array 'timestamp' e o array 'open'. Após iniciar o desenvolvimento, constatei que o objeto retornado contem apenas o timestamp do dia atual, para contornar a situação, desenvolvi um script que gera a data dos últimos 30 pregões a partir da data atual.

Foi criado a interface para a requisição dos dados do ativo, porém o retorno da propriedade 'contents' está sendo feito no formato de string, há a possibilidade de contornarmos isso criando um objeto com duas tipagens, mas para evitar possíveis inconsistências futuras, preferi usar 'any'. Nesse caso, a solução ideal seria que o endpoint retornasse o objeto sem estar convertido para string.

## Mais sobre mim

Caso haja o interesse em ver um exemplo prático da qualidade de meus trabalhos, convido você a conhecer um projeto pessoal desenhado e desenvolvido por mim, o AprovaEu! (www.aprovaeu.com.br), plataforma totalmente gratuita criada para auxiliar estudantes em suas jornadas rumo a aprovação.
