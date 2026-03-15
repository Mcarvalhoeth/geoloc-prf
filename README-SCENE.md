# 📍 GeoLoc Scene - Medição de Cena

Aplicação **offline-first** para medição de cenas de acidentes em iOS/iPhone. Um único arquivo HTML que funciona completamente no Safari sem necessidade de servidor.

---

## 🚀 Início Rápido

### **1. Baixe o arquivo**

```bash
git clone <repo-url>
cd geoloc-prf
# Arquivo: geoloc-scene.html
```

### **2. Copie para seu iPhone**

Escolha um método:

- **AirDrop** (mais rápido)
  - No Mac: Abra o Finder → Localize `geoloc-scene.html`
  - Clique com botão direito → AirDrop → Selecione seu iPhone

- **Email**
  - Anexe o arquivo em um email
  - Abra no iPhone → Toque em "Abrir com Safari"

- **iCloud Drive**
  - Copie para iCloud Drive no Mac
  - No iPhone: Archivos → iCloud Drive → Toque no arquivo

- **Google Drive / Dropbox**
  - Upload o arquivo
  - Abra no iPhone → Download → Abrir com Safari

### **3. Abra no Safari**

1. Abra o arquivo no **Safari** do seu iPhone
2. Quando aparecer "Solicitar permissão de localização" → Toque em **Permitir**
3. Aguarde até ver "AO VIVO" no canto superior direito ✅

---

## 📋 Funcionalidades

### **Ponto Zero** 📍
- Define a posição de referência da cena
- Toque em **DEFINIR PONTO ZERO** com GPS ativo
- Todas as distâncias serão medidas a partir deste ponto

### **Distância em Tempo Real** 📏
- Mostra a distância entre você e o Ponto Zero
- Atualiza conforme você se movimenta

### **Marcar Pontos** ➕
1. Escolha o tipo:
   - 🪦 **Corpo** - Posição do corpo
   - 💥 **Colisão** - Ponto de impacto
   - 🛑 **Frenagem** - Marcas de frenagem
   - 🚗 **Roda Dianteira Esquerda** - Posição específica do veículo
   - 📍 **Outro** - Qualquer outro ponto

2. (Opcional) Adicione uma **descrição**

3. Toque em **MARCAR PONTO ATUAL**

4. O ponto é registrado com:
   - Distância do Ponto Zero
   - Coordenadas relativas (X, Y)
   - Timestamp automático

### **Visualizar Marcadores** 📋
- Lista todos os pontos registrados
- Mostra: tipo, distância, coordenadas
- Toque **✕** para deletar um marcador

### **Exportar PDF** 📄
- Toque em **EXPORTAR PARA PDF** (habilitado quando há marcadores)
- Gera relatório automático com:
  - Ponto Zero e suas coordenadas
  - Todos os marcadores com distâncias
  - Data/hora de criação
- Salva como `scene_relatorio.pdf`

---

## 🔧 Como Funciona

### **Estrutura de Dados**

```javascript
// Ponto Zero
{
  id: "zero_1234567890",
  latitude: -23.5505,      // Referência GPS
  longitude: -46.6333,
  timestamp: 1234567890,
  rodovia: "BR-116",       // Opcional
  km: "123.5",            // Opcional
  municipio: "São Paulo"  // Opcional
}

// Marcador
{
  id: "marker_1234567890_rand",
  type: "corpo|colisao|frenagem|roda_esq|outro",
  latitude: -23.5506,
  longitude: -46.6334,
  timestamp: 1234567890,
  distanceFromZero: 45.8,      // Metros
  xRelative: 32.5,             // Distância relativa X
  yRelative: 28.3,             // Distância relativa Y
  description: "Perto da árvore"
}
```

### **Cálculos**

- **Distância**: Fórmula Haversine (distância entre dois pontos GPS)
- **Coordenadas Relativas**: Conversão de lat/lon para metros (X, Y)

---

## 💾 Persistência de Dados

Todos os dados são salvos automaticamente no **localStorage** do navegador:
- Sobrevive a fechamento do app
- Não requer internet
- Pode exportar/importar manualmente

Para **limpar dados**, toque no botão **LIMPAR** ao lado do Ponto Zero.

---

## 🌐 Usar com Servidor (Opcional)

Se preferir acessar via URL em rede:

```bash
# Na pasta do projeto:
python3 -m http.server 8000

# No iPhone Safari:
http://<seu-ip-local>:8000/geoloc-scene.html
```

---

## 📱 Requisitos

- **iOS 13+** (Safari)
- **GPS ativo** (permissão do dispositivo)
- **Internet** (para as bibliotecas CDN)

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura |
| **CSS3** | Interface modernista |
| **JavaScript (ES6+)** | Lógica da aplicação |
| **html2canvas** (CDN) | Renderização para PDF |
| **jsPDF** (CDN) | Geração de PDF |
| **localStorage** | Persistência de dados |
| **Geolocation API** | GPS do dispositivo |

---

## 🔒 Privacidade

- ✅ Nenhum dado é enviado para servidor
- ✅ Tudo fica no seu dispositivo
- ✅ Exportação local (PDF)

---

## 🐛 Troubleshooting

### "OFFLINE" / Sem sinal GPS
- Verifique se GPS está ativado no iPhone
- Abra Configurações → Safari → Privacidade → Localização
- Certifique-se de ter **Permitido** o acesso

### PDF não gera
- Certifique-se de ter **marcadores registrados**
- Tente novamente (às vezes demora 2-3s)

### Dados desapareceram
- Verificar localStorage: Abra as Ferramentas do Dev (Safari)
- Não limpe o histórico do Safari enquanto usar o app

---

## 📞 Suporte

Encontrou um bug? Crie uma issue no repositório!

---

**Versão:** 1.0
**Última atualização:** Março 2026
