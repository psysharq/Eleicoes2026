# Apuração das Eleições 2026

Painel para acompanhar a apuração das Eleições 2026 direto dos arquivos públicos de divulgação de resultados do Tribunal Superior Eleitoral (TSE). É uma página única (HTML, CSS e JavaScript no mesmo arquivo), sem servidor, sem cadastro e sem chave de acesso.

> **Projeto independente.** Não é um produto oficial do TSE nem tem vínculo com ele. Os números exibidos são os que o TSE publica; a fonte oficial e definitiva é sempre o [site de resultados do TSE](https://resultados.tse.jus.br/oficial/app/index.html).

## O que a página faz

- **Presidente:** mapa do Brasil com o contorno de cada estado, pintado de vermelho quando o Lula lidera e de azul quando o Flávio Bolsonaro lidera (cinza para outro candidato). Mostra o placar de estados, o resumo por região, o voto de brasileiros no exterior (separado, fora da contagem de estados), a diferença em votos, o quanto falta apurar e um gráfico de evolução ao longo da noite.
- **Governador e Senador:** um estado por vez (Pernambuco é o padrão), com foto, nome, nome completo, partido, número, vice (governador) ou suplentes (senador). Os 27 estados só são carregados se você pedir.
- **Deputado federal e estadual (distrital no DF):** quem já está eleito e quem está **se elegendo**, calculado a partir das vagas que o próprio arquivo do TSE atribui a cada partido ou federação. Há busca por nome, número ou partido, e um semicírculo de cadeiras por partido. A Câmara inteira (513 cadeiras) também é opcional.
- **Linha do tempo da apuração:** gráfico com o percentual de cada candidato, os votos acumulados ou o percentual de seções apuradas ao longo da noite, com três recortes: Brasil com o exterior, só o voto dado no Brasil (sem o exterior) e só o exterior. Tocar no gráfico mostra os valores de cada leitura. O TSE não publica histórico, então a linha é montada com as leituras que a página faz e fica guardada no aparelho: para registrar a noite inteira, deixe a página aberta com "Manter tela acesa" ligado. Dá para baixar o histórico em JSON.
- **Resultado por município** na aba Presidente, ao escolher um estado, e **por localidade no exterior** (cidades com seção eleitoral de brasileiros, como Abidjã e Abu Dhabi) ao escolher "Exterior".
- **Meus candidatos:** marque a estrela de qualquer candidato para acompanhá-lo num cartão fixo no topo (até 12).
- **Avisos (ícone de sino):** avisa quando presidente e governadores são definidos e quando um favorito é eleito ou vai ao 2º turno.
- **Compartilhar imagem:** gera uma imagem do resultado para enviar por aplicativo de mensagens.
- **Atualização automática** a cada 30 s, 1 min ou 2 min, com contagem regressiva.
- **Se o TSE falhar:** continua mostrando a última leitura boa, com aviso do horário, e tenta de novo com intervalos crescentes.
- **Tela acesa** durante o acompanhamento (quando o navegador permite) e nova leitura ao voltar para o aplicativo.
- **1º e 2º turno:** os códigos da eleição são lidos do arquivo de configuração do TSE, e há um seletor de turno.
- **Modo demonstração:** simula uma noite de apuração com números inventados, para testar o painel (veja os avisos abaixo).

## Segunda página: mapas por região e por cidade

O arquivo `mapas.html` é uma página separada, com dois blocos. O painel principal (`index.html`) tem um botão no topo que leva até ela, e ela tem um link de volta. O bloco de regiões é só do Presidente; o de cidades tem Presidente e Governador:

- **Presidente por região:** mapa do Brasil com Norte, Nordeste, Centro-Oeste, Sudeste e Sul, cada uma pintada pelo resultado somado dos seus estados. Tocar numa região mostra os estados dela.
- **Estados e cidades:** o mapa do Brasil funciona como **filtro**. Ao tocar num estado (ou escolhê-lo na lista), aparece o mapa de calor das cidades dele. O mapa de calor mostra quem lidera e por quanto, o **percentual de qualquer candidato** (escolhido numa lista) ou quanto já foi apurado. Cada cidade pode ser aberta para ver os candidatos, e há listas das cidades de maior vantagem de cada lado.
- **Governador por cidade:** no bloco de cidades, troque o cargo para **Governador**. Cada estado tem seus candidatos, então as cores são por candidato: a cor do candidato que lidera em cada cidade, mais forte quanto maior a vantagem, com a legenda dos candidatos do estado. Também dá para ver o percentual de um candidato escolhido na lista ou quanto já foi apurado. Há um resumo de quantas cidades cada candidato lidera, as cidades de maior vantagem dos dois primeiros e o detalhe de cada cidade. Só o estado escolhido é consultado (um arquivo do estado, mais as cidades). Se o TSE não tiver arquivo de governador para o estado no turno, a página avisa e não consulta as cidades. O endereço `mapas.html#pe-gov` abre direto no governador de Pernambuco.

Os contornos das cidades (fonte: IBGE, simplificados) já vão **dentro do próprio `mapas.html`**, um bloco por estado que só é lido quando o estado é escolhido. Por isso o arquivo é grande (cerca de 4,4 MB, ou 1,4 MB compactado quando o servidor comprime) e não é preciso enviar nenhuma pasta junto.

As cidades são lidas aos poucos (4 por vez, cerca de 12 por segundo, bem abaixo do limite do TSE), parando se o TSE pedir uma pausa ou se muitos arquivos ainda não existirem. A página consulta primeiro a lista de acompanhamento do estado (um arquivo só) para pedir apenas as cidades que já têm votos e mudaram desde a última leitura; se essa lista não puder ser lida, lê todas. Por padrão, as cidades do estado escolhido são atualizadas a cada 2 minutos. Há um bloco "Diagnóstico das cidades" que mostra o que foi pedido e o que o TSE respondeu, útil para relatar qualquer problema. O endereço `mapas.html#mg` abre direto em Minas Gerais.

### Atenção: não publique como "artefato" do Claude

O botão **Publicar** do Claude cria uma página que **não consegue ler o TSE** (pedidos a outros sites são bloqueados). Nesse modo os contornos aparecem, mas sem votos: os mapas ficam cinza, e só o modo "Demonstração" (números inventados) mostra cores. Use sempre o endereço do GitHub Pages, do Netlify ou de um servidor seu.

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
- A lista de municípios e de localidades no exterior foi conferida com o arquivo real do TSE, mas o resultado de cada município ou localidade só pôde ser testado com dados simulados, porque o arquivo real só existe depois da divulgação. Se algum não abrir, use o coletor com o endereço adicionado e verifique o formato.
- Governador e senador: "Na frente" e "Eleito" seguem a marcação do TSE; a página não projeta vencedor com base em resultado parcial. A ordem em que as urnas são totalizadas distorce parciais, então **resultado parcial não é previsão**.
- Em deputados, "Se elegendo" indica candidatos dentro das vagas já atribuídas ao partido ou federação na conta do TSE, e pode mudar até o fim da apuração. Com menos da metade das seções totalizadas, o TSE já distribui todas as vagas por uma conta parcial; nesse caso a página troca o rótulo para "Projeção" e exibe um aviso. Da mesma forma, enquanto a apuração está abaixo de 50%, a página não diz "venceria no 1º turno" ou "haveria 2º turno".
- Os horários exibidos são os da geração do arquivo pelo TSE, em horário de Brasília. O arquivo do exterior também traz a data e a hora da última seção no fuso local (que pode cair no dia seguinte), e por isso a página não usa esse campo.
- Notificações do sistema só funcionam com a página aberta; não há notificação com a página fechada.
- Se o navegador bloquear a leitura dos arquivos do TSE (CORS), será preciso servir os dados por um proxy próprio.
- O mapa usa contornos simplificados dos estados e das cidades (fonte: IBGE). Sete municípios criados recentemente (Mojuí dos Campos, Nazária, Balneário Rincão, Pescaria Brava, Pinto Bandeira, Paraíso das Águas e Boa Esperança do Norte) e a ilha de Fernando de Noronha não aparecem desenhados, mas os votos deles entram nas contagens.
- O resultado de cada cidade ainda não foi testado com arquivos reais do TSE (só com dados simulados). Se o mapa de cidades ficar vazio mesmo com a apuração em andamento, rode o coletor (opção "Cidade de teste: Recife") e verifique a resposta.

## Estrutura do repositório

```
index.html          # o painel
mapas.html          # mapas por região e por cidade (Presidente), com os contornos embutidos
coletor-tse.html    # coletor de arquivos para diagnóstico
README.md           # este arquivo
```

## Licença

Defina a licença que preferir antes de publicar (por exemplo, MIT) e adicione um arquivo `LICENSE`. Os dados e as fotos pertencem ao TSE e seguem as regras de uso do órgão.
