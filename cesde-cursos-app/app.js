document.addEventListener("DOMContentLoaded", function () {
    const listaCursos = document.getElementById("listaCursos");
    const formCurso = document.getElementById("formCurso");
    const filtroNombre = document.getElementById("filtroNombre");
    const filtroDuracion = document.getElementById("filtroDuracion");
    const filtroFecha = document.getElementById("filtroFecha");
    const docenteCurso = document.getElementById("docenteCurso");
  
    const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
    const successModal = new bootstrap.Modal(document.getElementById("successModal"));
  
    let cursos = [];
    let docentes = [];
  
    // Cargar docentes
    fetch("http://localhost:3001/docentes")
      .then((response) => response.json())
      .then((data) => {
        docentes = data;
        docenteCurso.innerHTML = data
          .map((docente) => `<option value="${docente.id}">${docente.nombre}</option>`)
          .join("");
      });
  
    // Cargar cursos
    function cargarCursos() {
      fetch("http://localhost:3001/cursos")
        .then((response) => response.json())
        .then((data) => {
          cursos = data;
          mostrarCursos(data);
        });
    }
  
    // Mostrar cursos
    function mostrarCursos(cursos) {
      listaCursos.innerHTML = cursos
        .map(
          (curso) => `
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${curso.nombre}</h5>
                <p class="card-text">${curso.descripcion}</p>
                <ul class="list-unstyled">
                  <li><strong>Duración:</strong> ${curso.duracion} semanas</li>
                  <li><strong>Precio:</strong> $${curso.precio}</li>
                  <li><strong>Fecha de inicio:</strong> ${new Date(curso.fechaInicio).toLocaleDateString()}</li>
                  <li><strong>Docente:</strong> ${docentes.find((d) => d.id === curso.docenteId)?.nombre}</li>
                </ul>
              </div>
            </div>
          </div>
        `
        )
        .join("");
    }
  
    // Validar formulario
    function validarFormulario() {
      const nombre = document.getElementById("nombreCurso").value.trim();
      const descripcion = document.getElementById("descripcionCurso").value.trim();
      const duracion = parseInt(document.getElementById("duracionCurso").value);
      const precio = parseFloat(document.getElementById("precioCurso").value);
      const fechaInicio = new Date(document.getElementById("fechaInicioCurso").value);
      const docenteId = parseInt(document.getElementById("docenteCurso").value);
  
      if (!nombre) {
        mostrarError("El nombre del curso no puede estar vacío.");
        return false;
      }
  
      if (!descripcion) {
        mostrarError("La descripción del curso no puede estar vacía.");
        return false;
      }
  
      if (isNaN(duracion) || duracion <= 0) {
        mostrarError("La duración debe ser un número mayor que 0.");
        return false;
      }
  
      if (isNaN(precio) || precio <= 0) {
        mostrarError("El precio debe ser un número mayor que 0.");
        return false;
      }
  
      if (isNaN(fechaInicio.getTime()) || fechaInicio < new Date()) {
        mostrarError("La fecha de inicio no puede ser una fecha pasada.");
        return false;
      }
  
      if (isNaN(docenteId)) {
        mostrarError("Debe seleccionar un docente.");
        return false;
      }
  
      return true;
    }
  
    // Mostrar error en modal
    function mostrarError(mensaje) {
      document.getElementById("errorMessage").textContent = mensaje;
      errorModal.show();
    }
  
    // Agregar curso
    formCurso.addEventListener("submit", function (e) {
      e.preventDefault();
  
      if (!validarFormulario()) return;
  
      const nuevoCurso = {
        nombre: document.getElementById("nombreCurso").value,
        descripcion: document.getElementById("descripcionCurso").value,
        duracion: parseInt(document.getElementById("duracionCurso").value),
        precio: parseFloat(document.getElementById("precioCurso").value),
        fechaInicio: new Date(document.getElementById("fechaInicioCurso").value).toISOString(),
        docenteId: parseInt(document.getElementById("docenteCurso").value),
      };
  
      fetch("http://localhost:3001/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoCurso),
      }).then(() => {
        cargarCursos();
        formCurso.reset();
        successModal.show();
      });
    });
  
    // Aplicar filtros
    filtroNombre.addEventListener("input", filtrarCursos);
    filtroDuracion.addEventListener("input", filtrarCursos);
    filtroFecha.addEventListener("input", filtrarCursos);
  
    // Cargar cursos al inicio
    cargarCursos();
  });