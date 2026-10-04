# Apuração das Eleições 2026

Painel para acompanhar a apuração das Eleições 2026 direto dos arquivos públicos de divulgação de resultados do Tribunal Superior Eleitoral (TSE). É uma página única (HTML, CSS e JavaScript no mesmo arquivo), sem servidor, sem cadastro e sem chave de acesso.

> **Projeto independente.** Não é um produto oficial do TSE nem tem vínculo com ele. Os números exibidos são os que o TSE publica; a fonte oficial e definitiva é sempre o [site de resultados do TSE](https://resultados.tse.jus.br/oficial/app/index.html).

## O que a página faz

- **Presidente:** mapa do Brasil com o contorno de cada estado, pintado de vermelho quando o Lula lidera e de azul quando o Flávio Bolsonaro lidera (cinza para outro candidato). Mostra o placar de estados, o resumo por região, o voto de brasileiros no exterior (separado, fora da contagem de estados), a diferença em votos, o quanto falta apurar e um gráfico de evolução ao longo da noite.
- **Governador e Senador:** um estado por vez (Pernambuco é o padrão), com foto, nome, nome completo, partido, número, vice (governador) ou suplentes (senador). Os 27 estados só são carregados se você pedir.
- **Deputado federal e estadual (distrital no DF):** quem já está eleito e quem está **se elegendo**, calculado a partir das vagas que o próprio arquivo do TSE atribui a cada partido ou federação. Há busca por nome, número ou partido, e um semicírculo de cadeiras por partido. A Câmara inteira (513 cadeiras) também é opcional.
- **Resultado por município** na aba Presidente, ao escolher um estado.
- **Meus candidatos:** marque a estrela de qualquer candidato para acompanhá-lo num cartão fixo no topo (até 12).
- **Avisos (ícone de sino):** avisa quando presidente e governadores são definidos e quando um favorito é eleito ou vai ao 2º turno.
- **Compartilhar imagem:** gera uma imagem do resultado para enviar por aplicativo de mensagens.
- **Atualização automática** a cada 30 s, 1 min ou 2 min, com contagem regressiva.
- **Se o TSE falhar:** continua mostrando a última leitura boa, com aviso do horário, e tenta de novo com intervalos crescentes.
- **Tela acesa** durante o acompanhamento (quando o navegador permite) e nova leitura ao voltar para o aplicativo.
- **1º e 2º turno:** os códigos da eleição são lidos do arquivo de configuração do TSE, e há um seletor de turno.
- **Modo demonstração:** simula uma noite de apuração com números inventados, para testar o painel (veja os avisos abaixo).

## Como usar

1. Abra o endereço onde a página foi publicada (ou abra o `index.html` no navegador).
2. No primeiro cartão, deixe o ambiente em **Oficial**. A atualização automática já vem ligada.
3. Escolha o cargo nas abas.

Antes da divulgação (que começa após o fim da votação, às 17h de Brasília), a página avisa que o TSE ainda não publicou os resultados e tenta de novo a cada 2 minutos.

### Ambientes

| Ambiente | Para que serve |
| --- | --- |
| **Oficial** | Resultados reais do TSE. |
| **Simulado do TSE** | Ambiente de testes que o próprio TSE disponibiliza. |
| **Demonstração** | Números inventados gerados pela página, sem ler nada do TSE. |

> **Atenção com a demonstração.** Nela, os votos, os percentuais e quem aparece como eleito são **inventados**. Os candidatos a presidente são os reais, para o visual ficar fiel, mas os demais cargos usam nomes fictícios. A página avisa isso na tela, nos avisos do sino e nas imagens compartilhadas. Não divulgue esses números como resultado ou pesquisa.

## Publicando no GitHub Pages

1. Crie um repositório público e envie `index.html` e `coletor-tse.html` na raiz.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.
3. Aguarde alguns minutos. O endereço será `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Em endereço seguro (https), a página consegue manter a tela acesa e usar as notificações do navegador. Para atualizar, envie o arquivo novo com o mesmo nome.

## Coletor de arquivos

O `coletor-tse.html` baixa os arquivos de resultado do TSE e junta tudo em um único pacote (`.json`). Serve para diagnosticar problemas e para conferir a estrutura real dos dados: ele também testa o endereço das fotos e o do exterior. Se algo não aparecer na página, rode o coletor, baixe o pacote e anexe a quem estiver ajudando a ajustar o painel.

## De onde vêm os dados

Os arquivos públicos de divulgação do TSE, lidos diretamente pelo navegador de cada pessoa. Informações técnicas e especificações dos arquivos: [Informações técnicas sobre a divulgação de resultados](https://www.tse.jus.br/eleicoes/informacoes-tecnicas-sobre-a-divulgacao-de-resultados).

| Dado | Origem |
| --- | --- |
| Resultados | `resultados.tse.jus.br/oficial/ele2026/<eleição>/dados/<abrangência>/…-u.json` |
| Códigos da eleição | `resultados.tse.jus.br/oficial/comum/config/ele-c.json` |
| Fotos | `resultados.tse.jus.br/oficial/ele2026/<eleição>/fotos/<abrangência>/<sqcand>.jpeg`, com o portal de candidaturas do TSE como alternativa |

**Limite de requisições.** O TSE limita cada endereço IP a 100 requisições por segundo, com bloqueio de 10 minutos. A página lê os arquivos um por vez, com intervalo entre eles, e só carrega os 27 estados quando necessário. Como cada visitante lê o TSE do próprio aparelho, muitos acessos ao mesmo painel não se somam no limite.

## Privacidade

- Não há servidor próprio, conta nem rastreamento. A página se comunica apenas com o TSE (resultados, fotos e portal de candidaturas) e com o Google Fonts, de onde vêm as fontes tipográficas (Barlow).
- Favoritos, preferências de avisos e a última leitura boa ficam salvos **apenas no navegador** de cada pessoa (armazenamento local).

## Limitações conhecidas

- O formato dos arquivos foi conferido com os arquivos que o TSE publicou antes da votação (zerados). O comportamento com votos reais, em volume de apuração, ainda precisa ser acompanhado.
- A lista de municípios e o resultado por município ainda não foram conferidos com arquivos reais do TSE. Se o seletor de município não carregar, rode o coletor (opção "Lista de municípios") e verifique o formato.
- Governador e senador: "Na frente" e "Eleito" seguem a marcação do TSE; a página não projeta vencedor com base em resultado parcial. A ordem em que as urnas são totalizadas distorce parciais, então **resultado parcial não é previsão**.
- Em deputados, "Se elegendo" indica candidatos dentro das vagas já atribuídas ao partido ou federação na conta do TSE, e pode mudar até o fim da apuração.
- Notificações do sistema só funcionam com a página aberta; não há notificação com a página fechada.
- Se o navegador bloquear a leitura dos arquivos do TSE (CORS), será preciso servir os dados por um proxy próprio.
- O mapa usa contornos simplificados dos estados.

## Estrutura do repositório

```
index.html          # o painel
coletor-tse.html    # coletor de arquivos para diagnóstico
README.md           # este arquivo
```

## Licença

Defina a licença que preferir antes de publicar (por exemplo, MIT) e adicione um arquivo `LICENSE`. Os dados e as fotos pertencem ao TSE e seguem as regras de uso do órgão.
