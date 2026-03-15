# 🐛 Relatório de Bugs - GeoLoc PRF

## Bugs Críticos Encontrados

### 1. **🔴 Service Worker retorna undefined para requisições externas**
**Arquivo:** `sw.js:22-26`
**Severidade:** CRÍTICA
**Descrição:** Quando uma requisição é externa (Overpass API, Nominatim), a função `fetch` handler retorna `undefined` ao invés de deixar passar. Isso faz com que as APIs falhem silenciosamente.
**Impacto:** Identifi​cação de rodovias e municípios não funciona.
**Solução:** Adicionar `return fetch(e.request)` para requisições externas.

---

### 2. **⚠️ Timeout GPS muito curto (15s)**
**Arquivo:** `index.html:194`
**Severidade:** ALTA
**Descrição:** `timeout: 15000` é insuficiente para obter sinal em áreas com má recepção.
**Impacto:** Falhas frequentes ao tentar rastrear em rodovias com sinal fraco.
**Solução:** Aumentar para `timeout: 30000` ou mais.

---

### 3. **⚠️ Race condition em lastOverpassCall**
**Arquivo:** `index.html:230-233`
**Severidade:** MÉDIA
**Descrição:** Múltiplas chamadas GPS rápidas podem gerar múltiplas requisições simultâneas ao Overpass.
**Impacto:** Consumo desnecessário de API e picos de tráfego.
**Solução:** Implementar flag de requisição em progresso.

---

### 4. **⚠️ Falta validação de resposta JSON**
**Arquivo:** `index.html:278-283`
**Severidade:** MÉDIA
**Descrição:** Se Overpass/Nominatim retornar status 200 com JSON inválido, `.json()` vai quebrar silenciosamente.
**Impacto:** Erro não aparece para o usuário, app fica travado.
**Solução:** Adicionar `try-catch` mais robusto e validar estrutura JSON.

---

### 5. **⚠️ Possível erro com toFixed() em valores null**
**Arquivo:** `index.html:216-217`
**Severidade:** BAIXA
**Descrição:** Se `altitude` ou `speed` forem null, `.toFixed()` vai causar erro.
**Impacto:** Crash quando GPS não fornece altitude/velocidade.
**Solução:** Verificar nullidade antes de chamar toFixed().

---

### 6. **⚠️ Memória não limpa se rastreamento travar**
**Arquivo:** `index.html:193-195`
**Severidade:** MÉDIA
**Descrição:** Se o watchPosition permanecer ativo por horas, pode consumir muita memória.
**Impacto:** Bateria drenada mais rápido.
**Solução:** Adicionar timeout automático ou listener de background.

---

### 7. **⚠️ Erro silencioso no fallback Nominatim**
**Arquivo:** `index.html:324-333`
**Severidade:** BAIXA
**Descrição:** Se Nominatim falhar, mensagem genérica "Sem conexão" não distingue erro de rede vs API indisponível.
**Impacto:** Difícil diagnosticar problemas.
**Solução:** Adicionar logging mais específico.

---

### 8. **⚠️ Copy to clipboard pode falhar sem feedback claro**
**Arquivo:** `index.html:343-346`
**Severidade:** BAIXA
**Descrição:** Se ambos clipboard.writeText e execCommand falharem, não há mensagem de erro.
**Impacto:** Usuário não sabe se dados foram copiados.
**Solução:** Adicionar feedback de erro no erro do fallback.

---

## Resumo
- **Críticos:** 1
- **Altos:** 1
- **Médios:** 3
- **Baixos:** 3

**Total:** 8 bugs encontrados
