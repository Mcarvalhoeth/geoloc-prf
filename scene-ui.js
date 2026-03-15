// ═══════════════════════════════════════════════════════════════════
// SCENE UI MANAGER - Gerenciador de UI para cena de acidente
// ═══════════════════════════════════════════════════════════════════

class SceneUIManager {
  constructor(sceneManager) {
    this.scene = sceneManager;
    this.currentMarkerType = 'outro';
    this.setupEventListeners();
  }

  setupEventListeners() {
    const markerSelect = $('marker-select');
    const btnMark = $('btn-mark');
    const btnSetZero = $('btn-set-zero');
    const btnClearZero = $('btn-clear-zero');

    if (markerSelect) {
      markerSelect.addEventListener('change', e => {
        this.currentMarkerType = e.target.value;
      });
    }

    if (btnMark) {
      btnMark.addEventListener('click', () => this.markCurrentPosition());
    }

    if (btnSetZero) {
      btnSetZero.addEventListener('click', () => this.setCurrentZeroPoint());
    }

    if (btnClearZero) {
      btnClearZero.addEventListener('click', () => this.clearZeroPoint());
    }
  }

  setCurrentZeroPoint() {
    if (!lastData) {
      showError('Aguarde sinal GPS antes de definir ponto zero.');
      return;
    }

    const { latitude, longitude } = lastData;
    const rodovia = lastData.rodovia || $('rod-name').textContent;
    const km = lastData.km || $('rod-km').textContent;
    const municipio = $('rod-muni').textContent;

    this.scene.setZeroPoint(latitude, longitude, rodovia, km, municipio);
    this.updateZeroPointUI();
    showInfo('✓ Ponto Zero definido com sucesso!');
  }

  clearZeroPoint() {
    if (confirm('Limpar ponto zero e todos os marcadores?')) {
      this.scene.clearZeroPoint();
      this.updateZeroPointUI();
      this.renderMarkersList();
      showInfo('Ponto Zero e marcadores limpos.');
    }
  }

  markCurrentPosition() {
    if (!lastData) {
      showError('Aguarde sinal GPS para marcar ponto.');
      return;
    }

    if (!this.scene.zeroPoint) {
      showError('Defina o Ponto Zero primeiro.');
      return;
    }

    const { latitude, longitude } = lastData;
    const descEl = $('marker-desc');
    const description = descEl ? descEl.value : '';

    try {
      this.scene.addMarker(latitude, longitude, this.currentMarkerType, description);
      if (descEl) descEl.value = '';
      this.renderMarkersList();
      this.updateDistanceDisplay();
      showInfo(`✓ Marcador "${this.getMarkerLabel(this.currentMarkerType)}" registrado!`);
    } catch (e) {
      showError(e.message);
    }
  }

  updateZeroPointUI() {
    const hasZero = this.scene.zeroPoint !== null;
    const statusEl = $('zero-point-status');
    const btnEl = $('btn-set-zero');
    const btnClearEl = $('btn-clear-zero');

    if (hasZero) {
      const z = this.scene.zeroPoint;
      statusEl.innerHTML = `✓ <strong>${z.rodovia} ${z.km}</strong><br>
        ${z.latitude.toFixed(6)}, ${z.longitude.toFixed(6)}<br>
        <small>${z.municipio}</small>`;
      statusEl.classList.add('active');
      btnEl.textContent = 'REDEFINIR PONTO ZERO';
      if (btnClearEl) btnClearEl.style.display = 'inline-block';
    } else {
      statusEl.textContent = 'Ponto Zero não definido';
      statusEl.classList.remove('active');
      btnEl.textContent = 'DEFINIR PONTO ZERO';
      if (btnClearEl) btnClearEl.style.display = 'none';
    }
  }

  updateDistanceDisplay() {
    const distEl = $('distance-value');
    if (!distEl) return;

    if (!lastData || !this.scene.zeroPoint) {
      distEl.textContent = '—';
      return;
    }

    const dist = this.scene.getDistanceFromZero(
      lastData.latitude,
      lastData.longitude
    );
    if (dist !== null) {
      distEl.textContent = dist.toFixed(1) + ' m';
    }
  }

  renderMarkersList() {
    const listEl = $('markers-list');
    const countEl = $('markers-count');
    const btnExport = $('btn-export-pdf');

    if (!listEl) return;

    if (this.scene.markers.length === 0) {
      listEl.innerHTML =
        '<div style="padding:20px;text-align:center;color:var(--muted);">Nenhum marcador registrado</div>';
      if (countEl) countEl.textContent = '0';
      if (btnExport) btnExport.disabled = true;
      return;
    }

    if (countEl) countEl.textContent = this.scene.markers.length;
    if (btnExport) btnExport.disabled = false;

    listEl.innerHTML = this.scene.markers
      .map(
        m => `
      <div class="marker-item ${m.type}">
        <div class="marker-item-label">${this.getMarkerLabel(m.type)}</div>
        <div class="marker-item-distance">${m.distanceFromZero.toFixed(1)} m</div>
        <div class="marker-item-coords" title="${m.latitude.toFixed(6)}, ${m.longitude.toFixed(6)}">
          X: ${m.xRelative.toFixed(1)}m | Y: ${m.yRelative.toFixed(1)}m
        </div>
        <div class="marker-item-time">${new Date(m.timestamp).toLocaleTimeString('pt-BR')}</div>
        <div class="marker-btn-group">
          <button class="marker-btn" onclick="sceneUI.editMarker('${m.id}')" title="Editar descrição">✎</button>
          <button class="marker-btn delete" onclick="sceneUI.deleteMarker('${m.id}')" title="Deletar">✕</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  deleteMarker(markerId) {
    if (confirm('Deletar este marcador?')) {
      this.scene.deleteMarker(markerId);
      this.renderMarkersList();
      this.updateDistanceDisplay();
    }
  }

  editMarker(markerId) {
    const marker = this.scene.markers.find(m => m.id === markerId);
    if (marker) {
      const newDesc = prompt('Nova descrição:', marker.description || '');
      if (newDesc !== null) {
        this.scene.updateMarker(markerId, { description: newDesc });
        this.renderMarkersList();
      }
    }
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

  async exportPDF() {
    showInfo('Gerando PDF... aguarde');
    try {
      const pdf = new ScenePDFGenerator(this.scene.export());
      await pdf.generate('scene_relatorio.pdf');
      showInfo('✓ PDF gerado com sucesso!');
    } catch (e) {
      showError('Erro ao gerar PDF: ' + e.message);
    }
  }
}

// Função global de info
function showInfo(msg) {
  const errEl = $('err-msg');
  if (errEl) {
    errEl.style.display = 'block';
    errEl.innerHTML = 'ℹ️ ' + msg;
    errEl.style.background = 'rgba(0, 214, 143, 0.1)';
    errEl.style.borderColor = '#00d68f';
    errEl.style.color = '#00d68f';
    setTimeout(() => {
      errEl.style.display = 'none';
    }, 3000);
  }
}
