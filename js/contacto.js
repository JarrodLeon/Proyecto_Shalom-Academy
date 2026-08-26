const form = document.getElementById('contactForm');
  const fechaInput = document.getElementById('fechaNacimiento');
  const edadHidden = document.getElementById('edadCalculada');
  const edadTexto = document.getElementById('edadTexto');

  // Cálculo de edad a partir de la fecha de nacimiento 
  function calcularEdad(fechaStr){
    const hoy = new Date();
    const nacimiento = new Date(fechaStr);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if(m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())){
      edad--;
    }
    return edad;
  }

  fechaInput.addEventListener('change', function(){
    if(!this.value){
      edadHidden.value = '';
      edadTexto.textContent = 'Edad calculada: —';
      return;
    }
    const edad = calcularEdad(this.value);
    edadHidden.value = edad;
    edadTexto.textContent = 'Edad calculada: ' + edad + ' años';
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    let valido = true;

    // Validación Bootstrap nativa (required, type=email, type=date, select)
    if(!form.checkValidity()){
      valido = false;
    }

    // Validación de al menos un genero seleccionado
    const generoOk = form.querySelector('input[name="genero"]:checked') !== null;
    document.getElementById('generoError').classList.toggle('d-none', generoOk);
    if(!generoOk) valido = false;

    // Validación propia: al menos un grado académico marcado
    const gradoOk = document.querySelectorAll('.grado-check:checked').length > 0;
    document.getElementById('gradoError').classList.toggle('d-none', gradoOk);
    if(!gradoOk) valido = false;

    // Validación fecha de nacimiento 
    if(fechaInput.value && new Date(fechaInput.value) > new Date()){
      fechaInput.setCustomValidity('La fecha no puede ser futura.');
      valido = false;
    } else {
      fechaInput.setCustomValidity('');
    }

    form.classList.add('was-validated');

    if(!valido){
      return;
    }

    document.getElementById('formMsg').style.display = 'block';
    form.reset();
    form.classList.remove('was-validated');
    edadTexto.textContent = 'Edad calculada: —';
    document.getElementById('generoError').classList.add('d-none');
    document.getElementById('gradoError').classList.add('d-none');
  });
