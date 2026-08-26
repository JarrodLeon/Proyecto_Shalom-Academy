// Carga dinámica de los programas desde data/programas.json (consumo tipo REST del propio sitio)
  fetch('data/programas.json')
    .then(function(res){
      if(!res.ok) throw new Error('No se pudo cargar programas.json');
      return res.json();
    })
    .then(function(programas){
      const grid = document.getElementById('programasGrid');
      grid.innerHTML = '';
      programas.forEach(function(p){
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-lg-3';
        col.innerHTML =
          '<div class="card-shalom h-100">' +
            '<span class="tag">' + p.edad + '</span>' +
            '<h3 class="h5">' + p.nombre + '</h3>' +
            '<p class="text-muted small mb-0">' + p.descripcion + '</p>' +
          '</div>';
        grid.appendChild(col);
      });
    })
    .catch(function(err){
      document.getElementById('programasLoading').textContent = 'No se pudieron cargar los programas (' + err.message + ').';
    });
