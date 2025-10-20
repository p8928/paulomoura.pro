# Pontos de Restauração do Projeto

Este arquivo contém informações sobre os pontos de restauração (commits) criados e os comandos necessários para ativá-los.

## Histórico de Commits

1. **Checkpoint: Creating restore point before major changes**
   - ID do Commit: 22db8600fa6622793ccd5977dcd077d4c60a00e7
   - Descrição: Ponto de restauração inicial antes de grandes mudanças

2. **Mobile overlay menu implementado com sucesso**
   - ID do Commit: 1ed7a4f3cebffafc918863448ca50fc316cc8167
   - Descrição: Implementação bem-sucedida do menu overlay mobile

3. **pre Brand-Driven**
   - ID do Commit: e919ac339b2752f893670f7c7a73311516e99c2a
   - Descrição: Estado do projeto antes das alterações relacionadas ao Brand-Driven

4. **brand-led design - novo texto**
   - ID do Commit: bacd7a380d3c5100cb6e47c145dc531333c4b7af
   - Descrição: Atualização do conteúdo com novo texto relacionado ao brand-led design

5. **remoção da sidebar nas páginas do blog**
   - ID do Commit: 2ae9b20e073c9f4bd23f9ecaf6fa85c321c6ebbd
   - Descrição: Remoção da sidebar das páginas do blog

6. **Otimização do sumário**
   - ID do Commit: 8602e93b21d6ebcfa554fd6528700424449b31d8
   - Descrição: Otimização do componente de sumário nas páginas

## Comandos para Ativar os Pontos de Restauração

Para retornar a qualquer um desses estados, utilize o seguinte comando Git substituindo <ID_DO_COMMIT> pelo ID correspondente:

```bash
git checkout <ID_DO_COMMIT>
```

### Exemplos:

Para retornar ao checkpoint inicial:
```bash
git checkout 22db8600fa6622793ccd5977dcd077d4c60a00e7
```

Para retornar à implementação do mobile overlay menu:
```bash
git checkout 1ed7a4f3cebffafc918863448ca50fc316cc8167
```

Para retornar ao estado pre Brand-Driven:
```bash
git checkout e919ac339b2752f893670f7c7a73311516e99c2a
```

Para retornar ao conteúdo do brand-led design:
```bash
git checkout bacd7a380d3c5100cb6e47c145dc531333c4b7af
```

Para retornar à remoção da sidebar do blog:
```bash
git checkout 2ae9b20e073c9f4bd23f9ecaf6fa85c321c6ebbd
```

Para retornar à otimização do sumário:
```bash
git checkout 8602e93b21d6ebcfa554fd6528700424449b31d8
```

## Dicas Adicionais

- Para voltar ao estado atual (HEAD), utilize `git checkout master` ou `git checkout main`
- Para criar um novo branch a partir de um ponto de restauração: `git checkout -b <nome_do_novo_branch> <ID_DO_COMMIT>`
- Para aplicar as alterações de um commit específico ao estado atual: `git cherry-pick <ID_DO_COMMIT>`