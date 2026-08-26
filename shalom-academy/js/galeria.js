// Carga dinámica de la galería/multimedia desde data/galeria.json
  let itemsData = [];

  function renderItems(items){
    const $grid = $('#galleryGrid');
    $grid.empty();

    items.forEach(function(item){
      let $col = $('<div>').addClass('col-6 col-md-4').attr('data-tipo', item.tipo);

      if(item.tipo === 'foto'){
        const pos = item.pos || 'center';
        $col.html(
          '<div class="gallery-item" data-bs-toggle="modal" data-bs-target="#imgModal" data-img="' + item.src + '" data-cap="' + item.caption + '">' +
            '<img src="' + item.thumb + '" alt="' + item.caption + '" loading="lazy" style="object-position:' + pos + ';">' +
            '<div class="cap">' + item.titulo + '</div>' +
          '</div>'
        );
      } else if(item.tipo === 'video'){
        $col.html(
          '<div class="media-card h-100">' +
            '<span class="tag"><i class="bi bi-camera-reels-fill"></i> Video</span>' +
            '<h3 class="h6 mb-2">' + item.titulo + '</h3>' +
            '<video controls poster="' + item.poster + '"><source src="' + item.src + '" type="video/mp4">Tu navegador no soporta video HTML5.</video>' +
            '<p class="small text-muted mt-2 mb-0">' + item.caption + '</p>' +
          '</div>'
        );
      } else if(item.tipo === 'audio'){
        $col.removeClass('col-6 col-md-4').addClass('col-12');
        $col.html(
          '<div class="media-card">' +
            '<span class="tag"><i class="bi bi-music-note-beamed"></i> Audio</span>' +
            '<h3 class="h6 mb-2">' + item.titulo + '</h3>' +
            '<audio controls style="width:100%;"><source src="' + item.src + '" type="audio/mpeg">Tu navegador no soporta audio HTML5.</audio>' +
            '<p class="small text-muted mt-2 mb-0">' + item.caption + '</p>' +
          '</div>'
        );
      }
      $grid.append($col);
    });

    // Lightbox con jQuery
    $('.gallery-item').off('click').on('click', function(){
      $('#modalImg').attr('src', $(this).data('img'));
      $('#modalCap').text($(this).data('cap'));
    });
  }

  $(function(){
    fetch('data/galeria.json')
      .then(function(res){
        if(!res.ok) throw new Error('No se pudo cargar galeria.json');
        return res.json();
      })
      .then(function(data){
        itemsData = data;
        renderItems(itemsData);
      })
      .catch(function(err){
        $('#galeriaLoading').text('No se pudo cargar el contenido (' + err.message + ').');
      });

    // Filtro por tipo (jQuery, interacción sobre el DOM)
    $('#filtroTipo').on('click', '.filtro-btn', function(){
      $('.filtro-btn').removeClass('active');
      $(this).addClass('active');
      const filtro = $(this).data('filtro');
      const filtrados = filtro === 'todos' ? itemsData : itemsData.filter(i => i.tipo === filtro);
      renderItems(filtrados);
    });
  });
