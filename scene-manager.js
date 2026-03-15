// ═══════════════════════════════════════════════════════════════════
// SCENE MANAGER - Gerenciador de dados de cena de acidente
// ═══════════════════════════════════════════════════════════════════

class SceneManager {
  constructor() {
    this.zeroPoint = null;
    this.markers = [];
    this.loadFromStorage();
  }

  setZeroPoint(lat, lon, rodovia, km, municipio) {
    this.zeroPoint = {
      id: 'zero_' + Date.now(),
      latitude: lat,
      longitude: lon,
      timestamp: Date.now(),
      rodovia,
      km,
      municipio
    };
    this.save();
    return this.zeroPoint;
  }

  clearZeroPoint() {
    this.zeroPoint = null;
    this.markers = [];
    this.save();
  }

  addMarker(lat, lon, type, description = '') {
    if (!this.zeroPoint) {
      throw new Error('Ponto Zero não definido');
    }

    const distance = haversine(
      this.zeroPoint.latitude,
      this.zeroPoint.longitude,
      lat,
      lon
    ) * 1000; // converter km para metros

    const relative = toRelativeCoordinates(
      lat,
      lon,
      this.zeroPoint.latitude,
      this.zeroPoint.longitude
    );

    const marker = {
      id: 'marker_' + Date.now() + '_' + Math.random(),
      type,
      latitude: lat,
      longitude: lon,
      timestamp: Date.now(),
      distanceFromZero: distance,
      xRelative: relative.x,
      yRelative: relative.y,
      description
    };

    this.markers.push(marker);
    this.save();
    return marker;
  }

  deleteMarker(markerId) {
    this.markers = this.markers.filter(m => m.id !== markerId);
    this.save();
  }

  updateMarker(markerId, updates) {
    const marker = this.markers.find(m => m.id === markerId);
    if (marker) {
      Object.assign(marker, updates);
      this.save();
    }
    return marker;
  }

  getDistanceFromZero(lat, lon) {
    if (!this.zeroPoint) return null;
    return (
      haversine(
        this.zeroPoint.latitude,
        this.zeroPoint.longitude,
        lat,
        lon
      ) * 1000
    ); // metros
  }

  save() {
    localStorage.setItem(
      'scene_data',
      JSON.stringify({
        zeroPoint: this.zeroPoint,
        markers: this.markers
      })
    );
  }

  loadFromStorage() {
    const data = localStorage.getItem('scene_data');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.zeroPoint = parsed.zeroPoint;
        this.markers = parsed.markers || [];
      } catch (e) {
        console.error('Erro ao carregar cena', e);
      }
    }
  }

  export() {
    return {
      zeroPoint: this.zeroPoint,
      markers: this.markers,
      exportedAt: new Date().toISOString()
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS GEOMÉTRICAS
// ═══════════════════════════════════════════════════════════════════

function toRelativeCoordinates(lat, lon, lat0, lon0) {
  // Projeção local (válida para distâncias < 100km)
  const R = 6371000; // Terra em metros
  const x =
    R *
    (lon - lon0) *
    Math.cos((lat0 * Math.PI) / 180) *
    (Math.PI / 180);
  const y = R * (lat - lat0) * (Math.PI / 180);
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100
  };
}

function fromRelativeCoordinates(x, y, lat0, lon0) {
  // Reverso: voltar para lat/lon a partir de x,y
  const R = 6371000;
  const lat = lat0 + (y / R) * (180 / Math.PI);
  const lon =
    lon0 +
    (x / (R * Math.cos((lat0 * Math.PI) / 180))) *
      (180 / Math.PI);
  return { lat, lon };
}

function calculateBoundingBox(points) {
  // Encontrar envelope dos marcadores para mapas/prints
  if (points.length === 0) return null;

  const lats = points.map(p => p.latitude);
  const lons = points.map(p => p.longitude);

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons)
  };
}
