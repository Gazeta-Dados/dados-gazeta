# Repositório de dados (automação do DataDash)

Este repositório **coleta os dados das fontes oficiais, guarda o histórico, trata e publica** os projetos do DataDash, sozinho, o ano inteiro.

```
Fontes oficiais ──► coleta (bruto/, com histórico) ──► tratamento (final/*.json)
                                                        │
                       app DataDash (Firebase) ◄────────┘  checagem: publica ou retém para revisão
                                │
                                ▼
          sites dos projetos ──► GitHub Pages  e/ou  servidor próprio
                                │
                       avisos por e-mail (issues) quando algo precisa de atenção
```

A automação roda **de hora em hora**, mas cada fonte é verificada **na própria agenda** (ex.: "todo dia 10 às 06:00", no horário de Brasília). Atualizações normais vão ao ar sozinhas. Só recebem aviso:

- dados com cara de defeito, que ficam retidos para revisão no app;
- falhas de coleta;
- fontes paradas por tempo demais;
- mudanças em dados de edições congeladas.

## Estrutura

| Pasta/arquivo | O que é |
|---|---|
| `fontes/<projeto>.yml` | **As fontes de cada projeto** (ex.: `fontes/anuario.yml`). São os arquivos que a redação edita. O nome do arquivo vira o nome do projeto. |
| `entrada/<projeto>/` | Planilhas preparadas pela equipe (.xlsx, .csv, .json), enviadas pelo site do GitHub. |
| `bruto/<projeto>/<fonte>/<ano>/` | Arquivos exatamente como a fonte publicou, com data. Só grava quando o conteúdo muda: é a prova de apuração. |
| `final/<projeto>/<fonte>.json` | Dados tratados (`meta`, `colunas`, `registros`), lidos pelo app. |
| `estado/` | Controle da automação (última verificação, publicação). Não editar. |
| `referencias/municipios-es.json` | Lista oficial do IBGE, baixada na primeira execução. |
| `.github/workflows/atualizar.yml` | O fluxo automático. |

## Configuração (uma vez só, pela TI ou por quem administra o GitHub)

### 1. Repositórios na organização da Rede Gazeta
Crie os repositórios na **organização**, não numa conta pessoal, para o projeto não depender de uma pessoa:
- **`datadash-app` (privado):** o código do app (o pacote .zip do DataDash).
- **`anuario-dados` (público):** o conteúdo desta pasta.

O repositório de dados é público porque os dados já são públicos e porque, assim, o GitHub Pages e os minutos do GitHub Actions são gratuitos. **Bases com dados pessoais não vão para cá**; veja `dados_pessoais` nos arquivos de `fontes/`.

### 2. Segredos e variáveis do `anuario-dados`
Em *Settings → Secrets and variables → Actions*:

| Tipo | Nome | Valor |
|---|---|---|
| Variável | `APP_REPO` | `organizacao/datadash-app` |
| Segredo | `APP_REPO_TOKEN` | *Fine-grained token* com acesso **somente** ao `datadash-app` e permissão *Contents: Read-only*. Anote a data de expiração e renove antes dela. |
| Segredo | `FIREBASE_SERVICE_ACCOUNT` | O JSON inteiro de uma chave de conta de serviço do Firebase (veja abaixo). |

**Conta de serviço do Firebase.** O recomendado é criar, no Google Cloud do projeto do Firebase, uma conta de serviço só para a automação, com o papel **Cloud Datastore User**, e gerar uma chave JSON para ela. A alternativa mais simples (Console do Firebase → Configurações do projeto → Contas de serviço → Gerar nova chave privada) cria uma chave com permissões amplas demais. Coloque o mesmo segredo no `datadash-app`, para a cópia de segurança noturna.

**Servidor próprio (opcional).** Variáveis `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH` e `DEPLOY_PORT` (padrão 22), mais o segredo `DEPLOY_SSH_KEY` (chave privada de um usuário que só pode escrever na pasta de destino). O envio usa `rsync` por SSH.

**Sem GitHub Pages (opcional).** Variável `GITHUB_PAGES` = `false`.

### 3. GitHub Pages
*Settings → Pages → Build and deployment → Source: **GitHub Actions***. Para usar um endereço da Gazeta (ex.: `anuario.agazeta.com.br`), informe-o em *Custom domain* e crie o registro DNS (CNAME) indicado pelo GitHub.

### 4. Receber os avisos por e-mail
Quem deve ser avisado: no repositório, *Watch → Custom → **Issues***. Os avisos têm a etiqueta `automacao` e uma etiqueta de tipo (`aguardando-revisao`, `erro-na-coleta`, `atencao`). Quando o problema se resolve, a automação fecha a issue sozinha.

### 5. Marcar os projetos para publicação
No app: *Configurações do projeto → Publicação → **Publicar automaticamente pelo GitHub***. Preencha o *Endereço de publicação* com o endereço final, por exemplo `https://anuario.agazeta.com.br/<projeto>/`. Páginas em rascunho ou arquivadas não são publicadas.

## Uso no dia a dia

**Portais CKAN (como o dados.es.gov.br).** Não use a página do conjunto como `url`: use o bloco `ckan` (ver exemplo em `fontes/anuario.yml`). A automação consulta a API do portal, encontra os arquivos pelo nome e, com `combinar: true`, junta todos os anos numa série. Quando o portal publica o arquivo de um ano novo, ele entra sozinho, sem mudar a configuração.

**Planilhas da equipe (Excel).** Envie a planilha para `entrada/<projeto>/` (Add file → Upload files), sempre com o mesmo nome de arquivo, e configure a fonte com `arquivo:` (há um exemplo comentado em `fontes/anuario.yml`). Quando houver versão nova, é só enviar de novo: a automação percebe na hora seguinte. A automação lê a aba escolhida, acha o cabeçalho mesmo que não esteja na primeira linha, converte datas do Excel e usa o valor calculado das fórmulas.

**Separar por projeto.** Cada arquivo em `fontes/` é um projeto, com pastas próprias em `final/`, `bruto/` e `entrada/`. Os avisos chegam com o nome do projeto no título e a etiqueta `projeto:<nome>`, para filtrar. Para um projeto novo, copie `fontes/anuario.yml` com outro nome.

**Acrescentar ou mudar uma fonte.** Edite o arquivo do projeto em `fontes/` pelo próprio GitHub (ícone de lápis). O arquivo é comentado linha a linha. O `dataset_id` aparece no app em *Bases → Versões e edições*. Para testar: *Actions → Atualizar dados e publicar → Run workflow*, com "forcar" marcado.

**Chegou um aviso "Dados novos aguardando revisão".** Abra o app em *Bases → a base → Versões e edições*, confira o que mudou na fonte original e aprove ou descarte. Os painéis continuam com a versão anterior até a decisão. A issue fecha sozinha depois.

**Chegou um aviso "Falha na coleta".** Normalmente o portal saiu do ar ou mudou o endereço. Se mudou, atualize a `url` no arquivo do projeto em `fontes/`.

**Pausar uma fonte.** Use `ativo: false` no arquivo do projeto.

## Limites e cuidados
- **Atrasos do GitHub:** o agendador do GitHub pode atrasar alguns minutos e, em horários de pico, pular execuções. Por isso ele roda de hora em hora.
- **Arquivos grandes:** arquivos acima de 90 MB são tratados, mas o bruto daquela coleta não é arquivado (o GitHub recusa arquivos acima de 100 MB).
- **Repositório sem atividade:** em repositórios públicos, o GitHub pode desativar agendamentos após 60 dias sem atividade. Os commits da automação contam como atividade, mas, se as fontes ficarem paradas por muito tempo, confira em *Actions* se o fluxo está ativo.
- **Segurança do fluxo:** o fluxo só roda por agendamento ou acionamento manual. Não acrescente gatilhos de *pull request* (eles poderiam expor os segredos).
- **Responsabilidade editorial:** números publicados continuam sob responsabilidade da redação. A checagem automática pega defeitos de dados, não avalia se um número é notícia.
