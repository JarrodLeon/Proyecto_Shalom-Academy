// Coordenadas de Shalom Academy, Turrucares, Alajuela, Costa Rica
  const ACADEMY_LAT = 9.9586343;
  const ACADEMY_LNG = -84.320118;

  // Consumo de API REST externa (Open-Meteo, gratuita)
  const codigosClima = {
    0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
    45: 'Neblina', 48: 'Neblina con escarcha', 51: 'Llovizna ligera', 53: 'Llovizna',
    55: 'Llovizna intensa', 61: 'Lluvia ligera', 63: 'Lluvia', 65: 'Lluvia intensa',
    80: 'Chubascos ligeros', 81: 'Chubascos', 82: 'Chubascos fuertes',
    95: 'Tormenta eléctrica'
  };

  fetch('https://api.open-meteo.com/v1/forecast?latitude=' + ACADEMY_LAT + '&longitude=' + ACADEMY_LNG + '&current_weather=true&timezone=America%2FCosta_Rica')
    .then(function(res){
      if(!res.ok) throw new Error('Servicio de clima no disponible');
      return res.json();
    })
    .then(function(data){
      const c = data.current_weather;
      const descripcion = codigosClima[c.weathercode] || 'Condición ' + c.weathercode;
      document.getElementById('climaBox').innerHTML =
        Math.round(c.temperature) + '°C · ' + descripcion + ' · viento ' + Math.round(c.windspeed) + ' km/h';
    })
    .catch(function(err){
      document.getElementById('climaBox').textContent = 'No se pudo obtener el clima (' + err.message + ').';
    });

  function haversineKm(lat1, lon1, lat2, lon2){
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  document.getElementById('geoBtn').addEventListener('click', function(){
    const resultBox = document.getElementById('geoResult');
    const routeLink = document.getElementById('routeLink');
    if(!('geolocation' in navigator)){
      resultBox.style.display = 'block';
      resultBox.textContent = 'Tu navegador no soporta geolocalización.';
      return;
    }
    resultBox.style.display = 'block';
    resultBox.classList.remove('ok');
    resultBox.textContent = 'Buscando tu ubicación...';

    navigator.geolocation.getCurrentPosition(
      function(pos){
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy); // metros
        const dist = haversineKm(lat, lng, ACADEMY_LAT, ACADEMY_LNG);
        const distTxt = dist < 1 ? Math.round(dist * 1000) + ' m' : dist.toFixed(1) + ' km';

        resultBox.classList.add('ok');
        let html =
          '📍 Estás aproximadamente a <strong>' + distTxt + '</strong> de Shalom Academy.<br>' +
          '<span class="small fw-normal">Precisión del GPS: ±' + accuracy + ' m';
        if(accuracy > 3000){
          html += ' — tu navegador está usando ubicación aproximada por red/WiFi, no GPS real. En un celular con GPS activado el resultado es mucho más exacto.';
        }
        html += '</span>';
        resultBox.innerHTML = html;

        // Trazar la ruta en el mapa
        const mapFrame = document.getElementById('mapFrame');
        mapFrame.src = 'https://www.google.com/maps?saddr=' + lat + ',' + lng +
                        '&daddr=' + ACADEMY_LAT + ',' + ACADEMY_LNG + '&output=embed';

        routeLink.href = 'https://www.google.com/maps/dir/?api=1&origin=' + lat + ',' + lng +
                          '&destination=' + ACADEMY_LAT + ',' + ACADEMY_LNG;
        routeLink.classList.remove('d-none');
      },
      function(err){
        resultBox.textContent = 'No pudimos acceder a tu ubicación (' + err.message + '). Verifica los permisos del navegador.';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
