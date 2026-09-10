/* ─── File Upload Handler ─── */
  function handleFiles(files) {
    var list = document.getElementById('fileList');
    list.innerHTML = '';
    Array.from(files).forEach(function(file) {
      var item = document.createElement('div');
      item.className = 'form-upload__file';
      item.innerHTML =
        '<span class="material-icons">image</span>' +
        '<span class="form-upload__file__name">' + file.name + '</span>' +
        '<span class="form-upload__file__size">' + (file.size / 1024 / 1024).toFixed(1) + ' MB</span>';
      list.appendChild(item);
    });
  }

  /* ─── Drag & Drop ─── */
  var zone = document.getElementById('uploadZone');
  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('--dragover'); });
  zone.addEventListener('dragleave', function() { zone.classList.remove('--dragover'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault();
    zone.classList.remove('--dragover');
    document.getElementById('fotoInput').files = e.dataTransfer.files;
    handleFiles(e.dataTransfer.files);
  });

  /* ─── Form submit (Platzhalter) ─── */
  document.getElementById('reklamationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Formular abgesendet. (Platzhalter — Backend-Integration ausstehend)');
  });
