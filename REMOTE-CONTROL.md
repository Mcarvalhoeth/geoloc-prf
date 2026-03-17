# Remote Control — Compartilhamento de Localização

O **Remote Control** do GeoLoc PRF permite que um agente compartilhe sua localização GPS em tempo real com outros dispositivos (coordenação, base, outros agentes) sem precisar de conta, login ou servidor externo.

---

## Como funciona

O recurso gera um **link (URL)** com as coordenadas GPS atuais, o nome da rodovia, o quilômetro e o município. Quem receber o link abre no navegador e vê as informações instantaneamente.

---

## Passo a passo — Quem compartilha (agente em campo)

1. Abra o **GeoLoc PRF** no celular.
2. Toque em **INICIAR RASTREAMENTO** e aguarde o GPS fixar.
3. Após o sinal ser obtido, o botão **📡 COMPARTILHAR LOCALIZAÇÃO** aparecerá na tela.
4. Toque no botão.
   - No celular: o menu de compartilhamento do sistema abrirá (WhatsApp, Telegram, SMS etc.).
   - No computador: o link será copiado para a área de transferência automaticamente.
5. Envie o link pelo canal de comunicação desejado.

> **Dica:** Sempre que sua posição mudar, compartilhe um novo link para atualizar quem está acompanhando.

---

## Passo a passo — Quem recebe (coordenação / base)

1. Receba o link compartilhado pelo agente em campo.
2. Abra o link em qualquer navegador (celular ou computador).
3. O GeoLoc PRF abrirá em **modo de visualização remota** — identificado pela faixa verde no topo da tela.
4. As informações exibidas são:
   - **Rodovia e KM** do agente
   - **Latitude e Longitude** exatas
   - **Município** e horário do registro
5. Toque em **VER NO GOOGLE MAPS** para abrir a localização no mapa.

---

## Exemplo de link gerado

```
https://mcarvalhoeth.github.io/geoloc-prf/?lat=-23.550651&lon=-46.633382&road=BR-116&km=284.3&muni=S%C3%A3o%20Paulo%20%C2%B7%20SP&ts=14%3A32%3A10%20%C2%B7%2017%2F03%2F2026
```

Os parâmetros do link:

| Parâmetro | Descrição               | Exemplo         |
|-----------|-------------------------|-----------------|
| `lat`     | Latitude                | `-23.550651`    |
| `lon`     | Longitude               | `-46.633382`    |
| `road`    | Nome da rodovia         | `BR-116`        |
| `km`      | Quilômetro na rodovia   | `284.3`         |
| `muni`    | Município · Estado      | `São Paulo · SP`|
| `ts`      | Horário do registro     | `14:32:10 · ...`|

---

## Casos de uso

- **Ocorrência em rodovia**: agente compartilha posição exata com a central para despacho de socorro.
- **Acidente com múltiplas viaturas**: todos os agentes compartilham links, a coordenação acompanha cada posição.
- **Registro de ponto zero**: compartilhar a localização do ponto de referência da cena do acidente com a equipe de perícia.

---

## Limitações

- O link é um **instantâneo** da posição no momento do compartilhamento — não é atualizado automaticamente.
- Para atualizar a posição, o agente deve compartilhar um novo link.
- Não requer internet para gerar o link, mas quem recebe precisa de internet para abrir o app.
- Funciona sem aplicativo instalado — apenas um navegador moderno.

---

## Privacidade e segurança

- O link contém coordenadas GPS precisas. **Compartilhe apenas por canais seguros e autorizados.**
- Não há armazenamento em servidor — as coordenadas ficam somente na URL.
- O link expira quando a operação é encerrada (basta não compartilhá-lo mais).
