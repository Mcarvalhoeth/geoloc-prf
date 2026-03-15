// ═══════════════════════════════════════════════════════════════════
// PDF GENERATOR - Gerador de PDF para relatório de cena
// ═══════════════════════════════════════════════════════════════════

class ScenePDFGenerator {
  constructor(sceneData) {
    this.data = sceneData;
  }

  async generate(filename) {
    const html = this.generateHTML();

    // Criar elemento temporário
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '1000px';
    document.body.appendChild(container);

    try {
      // Usar html2canvas para converter para imagem
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#0a0c10',
        logging: false
      });

      // Usar jsPDF para criar PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width em mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let heightLeft = imgHeight;
      let position = 0;

      // Adicionar múltiplas páginas se necessário
      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297; // altura A4
        if (heightLeft > 0) {
          pdf.addPage();
          position = heightLeft - imgHeight;
        }
      }

      pdf.save(filename);
    } finally {
      document.body.removeChild(container);
    }
  }

  generateHTML() {
    const { zeroPoint, markers, exportedAt } = this.data;

    if (!zeroPoint) {
      return '<div style="padding:20px;">Nenhuma cena definida</div>';
    }

    return `
      <div style="padding:20px;font-family:monospace;background:#0a0c10;color:#e8edf5;width:100%;">
        <h1 style="color:#00e5ff;text-align:center;margin:0 0 20px 0;border-bottom:2px solid #1e2530;padding-bottom:15px;">
          📋 RELATÓRIO DE CENA DE ACIDENTE
        </h1>

        <div style="margin:20px 0;border:2px solid #1e2530;padding:15px;border-radius:8px;background:#10141c;">
          <h2 style="color:#ff6b00;margin:0 0 15px 0;font-size:16px;">🛣️ LOCAL DO ACIDENTE</h2>
          <table style="width:100%;font-size:13px;line-height:1.8;">
            <tr><td style="width:30%;color:#00e5ff;font-weight:bold;">Rodovia:</td><td>${zeroPoint.rodovia}</td></tr>
            <tr><td style="color:#00e5ff;font-weight:bold;">KM:</td><td>${zeroPoint.km}</td></tr>
            <tr><td style="color:#00e5ff;font-weight:bold;">Município:</td><td>${zeroPoint.municipio}</td></tr>
            <tr style="background:rgba(0,229,255,0.05);"><td style="color:#00e5ff;font-weight:bold;">Latitude:</td><td>${zeroPoint.latitude.toFixed(6)}</td></tr>
            <tr style="background:rgba(0,229,255,0.05);"><td style="color:#00e5ff;font-weight:bold;">Longitude:</td><td>${zeroPoint.longitude.toFixed(6)}</td></tr>
            <tr><td style="color:#00e5ff;font-weight:bold;">Data/Hora:</td><td>${new Date(zeroPoint.timestamp).toLocaleString('pt-BR')}</td></tr>
          </table>
        </div>

        ${markers.length > 0 ? `
          <div style="margin:20px 0;border:2px solid #1e2530;padding:15px;border-radius:8px;background:#10141c;">
            <h2 style="color:#00e5ff;margin:0 0 15px 0;font-size:16px;">📍 PONTOS MARCADOS (${markers.length})</h2>
            ${this.generateMarkersTable(markers)}
          </div>

          <div style="margin:20px 0;border:2px solid #1e2530;padding:15px;border-radius:8px;background:#10141c;">
            <h2 style="color:#00d68f;margin:0 0 15px 0;font-size:16px;">📐 COORDENADAS RELATIVAS (X,Y)</h2>
            <table style="width:100%;font-size:12px;margin-top:10px;">
              <tr style="background:#1e2530;">
                <th style="padding:8px;text-align:left;color:#00e5ff;border-bottom:2px solid #00e5ff;">Tipo</th>
                <th style="padding:8px;text-align:right;color:#00e5ff;border-bottom:2px solid #00e5ff;">X (m)</th>
                <th style="padding:8px;text-align:right;color:#00e5ff;border-bottom:2px solid #00e5ff;">Y (m)</th>
                <th style="padding:8px;text-align:right;color:#00e5ff;border-bottom:2px solid #00e5ff;">Distância</th>
              </tr>
              ${markers.map(m => `
                <tr style="border-bottom:1px solid #1e2530;">
                  <td style="padding:8px;color:${this.getMarkerColor(m.type)};font-weight:bold;">${this.getMarkerLabel(m.type)}</td>
                  <td style="padding:8px;text-align:right;color:#e8edf5;">${m.xRelative.toFixed(2)}</td>
                  <td style="padding:8px;text-align:right;color:#e8edf5;">${m.yRelative.toFixed(2)}</td>
                  <td style="padding:8px;text-align:right;color:#00e5ff;font-weight:bold;">${m.distanceFromZero.toFixed(1)} m</td>
                </tr>
              `).join('')}
            </table>
          </div>
        ` : ''}

        <div style="margin-top:40px;padding-top:20px;border-top:2px solid #1e2530;font-size:11px;color:#4a5568;text-align:center;">
          <p style="margin:0;">Relatório gerado por: <strong>GeoLoc PRF</strong></p>
          <p style="margin:5px 0 0 0;">${new Date(exportedAt).toLocaleString('pt-BR')}</p>
        </div>
      </div>
    `;
  }

  generateMarkersTable(markers) {
    return `
      <table style="width:100%;border-collapse:collapse;margin:10px 0;">
        <thead>
          <tr style="background:#1e2530;">
            <th style="padding:10px;text-align:left;color:#00e5ff;border-bottom:2px solid #00e5ff;">Nº</th>
            <th style="padding:10px;text-align:left;color:#00e5ff;border-bottom:2px solid #00e5ff;">Tipo</th>
            <th style="padding:10px;text-align:right;color:#00e5ff;border-bottom:2px solid #00e5ff;">Distância</th>
            <th style="padding:10px;text-align:left;color:#00e5ff;border-bottom:2px solid #00e5ff;">Descrição</th>
            <th style="padding:10px;text-align:left;color:#00e5ff;border-bottom:2px solid #00e5ff;">Hora</th>
          </tr>
        </thead>
        <tbody>
          ${markers.map((m, idx) => `
            <tr style="background:${this.getMarkerBgColor(m.type)};border-bottom:1px solid #1e2530;">
              <td style="padding:10px;color:#4a5568;font-weight:bold;text-align:center;">${idx + 1}</td>
              <td style="padding:10px;color:${this.getMarkerColor(m.type)};font-weight:bold;">${this.getMarkerLabel(m.type)}</td>
              <td style="padding:10px;text-align:right;color:#00e5ff;font-weight:bold;">${m.distanceFromZero.toFixed(1)} m</td>
              <td style="padding:10px;color:#e8edf5;font-size:12px;">${m.description || '—'}</td>
              <td style="padding:10px;color:#4a5568;font-size:11px;">${new Date(m.timestamp).toLocaleTimeString('pt-BR')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  getMarkerColor(type) {
    const colors = {
      corpo: '#ff6b6b',
      colisao: '#ff6b00',
      frenagem: '#ffcc00',
      roda_esq: '#00d68f',
      outro: '#4a5568'
    };
    return colors[type] || '#e8edf5';
  }

  getMarkerBgColor(type) {
    const color = this.getMarkerColor(type);
    // Converter hex para rgba com opacity
    return color + '1a'; // ~10% opacity
  }

  getMarkerLabel(type) {
    const labels = {
      corpo: 'CORPO',
      colisao: 'COLISÃO',
      frenagem: 'FRENAGEM',
      roda_esq: 'RODA ESQ',
      outro: 'OUTRO'
    };
    return labels[type] || type;
  }
}
