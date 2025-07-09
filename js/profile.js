document.addEventListener('DOMContentLoaded', function() {
  // Dados do estudante (simulados - na prática viriam do Firebase)
  const studentData = {
    name: "FATOMANIA",
    school: "KutivaMANIA",
    classInfo: "Oculto",
    studentId: "00000000",
    class: "Oculto",
    academicYear: "2025",
    averageGrade: "Ocult",
    booksRead: "00000",
    subjects: "0",
    studyHours: "0000",
    completedModules: "0000000000",
    recentActivities: [
      { icon: "book", text: "00000000000000000", time: "horas atrás" },
      { icon: "check-circle", text: "00000000000000000", time: "Ontem" },
      { icon: "award", text: "0000000000000", time: "3 dias atrás" }
    ],
    profilePic: "images/default-profile.jpg"
  };
  
  // Atualiza os dados do perfil
  updateProfile(studentData);
  loadRecentActivities(studentData.recentActivities);
  
  // Configuração do background
  setupBackground();
  
  // Configuração da foto de perfil
  setupProfilePic();
  
  // Event listeners
  document.querySelector('.logout-btn')?.addEventListener('click', function() {
    if (confirm('Tem certeza que deseja sair?')) {
      // Aqui você adicionaria o logout do Firebase
      window.location.href = "login.html";
    }
  });
});

function updateProfile(data) {
  document.getElementById('student-name').textContent = data.name;
  document.getElementById('school-info').textContent = data.school;
  document.getElementById('class-info').textContent = data.classInfo;
  document.getElementById('student-id').textContent = data.studentId;
  document.getElementById('class').textContent = data.class;
  document.getElementById('academic-year').textContent = data.academicYear;
  document.getElementById('average-grade').textContent = data.averageGrade;
  document.getElementById('books-read').textContent = data.booksRead;
  document.getElementById('subjects').textContent = data.subjects;
  document.getElementById('study-hours').textContent = data.studyHours;
  document.getElementById('completed-modules').textContent = data.completedModules;
  
  // Carrega foto de perfil se existir no localStorage
  const savedProfilePic = localStorage.getItem('profilePic');
  if (savedProfilePic) {
    document.getElementById('profile-pic').src = savedProfilePic;
  } else if (data.profilePic) {
    document.getElementById('profile-pic').src = data.profilePic;
  }
}

function loadRecentActivities(activities) {
  const activityList = document.getElementById('activity-list');
  activityList.innerHTML = ''; // Limpa atividades existentes
  
  const icons = {
    'book': 'fas fa-book',
    'check-circle': 'fas fa-check-circle',
    'award': 'fas fa-award'
  };
  
  activities.forEach(activity => {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    activityItem.innerHTML = `
      <div class="activity-icon">
        <i class="${icons[activity.icon]}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-text">${activity.text}</div>
        <small class="activity-time">${activity.time}</small>
      </div>
    `;
    
    activityList.appendChild(activityItem);
  });
}

function setupBackground() {
  const changeBgBtn = document.getElementById('change-bg-btn');
  const bgOptionsMenu = document.getElementById('bg-options-menu');
  const bgFileInput = document.getElementById('bg-file-input');
  const uploadVideoBtn = document.getElementById('upload-video-btn');
  const uploadImageBtn = document.getElementById('upload-image-btn');
  
  // Carrega o background salvo no localStorage
  const savedBg = localStorage.getItem('profileBackground');
  if (savedBg) {
    setBackground(JSON.parse(savedBg));
  }
  
  // Mostrar/esconder menu de opções
  if (changeBgBtn) {
    changeBgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      bgOptionsMenu.classList.toggle('show');
    });
  }
  
  // Fechar menu quando clicar fora
  document.addEventListener('click', () => {
    if (bgOptionsMenu) bgOptionsMenu.classList.remove('show');
  });
  
  // Prevenir que o clique no menu feche ele
  if (bgOptionsMenu) {
    bgOptionsMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  // Opções pré-definidas
  document.querySelectorAll('.bg-option[data-type]').forEach(option => {
    option.addEventListener('click', () => {
      const type = option.dataset.type;
      const src = option.dataset.src;
      setBackground({ type, src });
      saveBackground({ type, src });
      if (bgOptionsMenu) bgOptionsMenu.classList.remove('show');
    });
  });
  
  // Upload de arquivo
  if (uploadVideoBtn) {
    uploadVideoBtn.addEventListener('click', () => {
      bgFileInput.setAttribute('accept', 'video/*');
      bgFileInput.click();
    });
  }
  
  if (uploadImageBtn) {
    uploadImageBtn.addEventListener('click', () => {
      bgFileInput.setAttribute('accept', 'image/*');
      bgFileInput.click();
    });
  }
  
  if (bgFileInput) {
    bgFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const type = file.type.includes('video') ? 'video' : 'image';
        const url = URL.createObjectURL(file);
        
        setBackground({ type, src: url });
        saveBackground({ type, src: url });
        if (bgOptionsMenu) bgOptionsMenu.classList.remove('show');
      }
    });
  }
  
  function setBackground({ type, src }) {
    const profileCover = document.querySelector('.profile-cover');
    if (!profileCover) return;
    
    // Limpa o container
    profileCover.innerHTML = '';
    
    if (type === 'video') {
      const video = document.createElement('video');
      video.className = 'profile-cover-video';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      
      const source = document.createElement('source');
      source.src = src;
      source.type = 'video/mp4';
      video.appendChild(source);
      
      profileCover.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.className = 'profile-cover-image';
      img.src = src;
      img.style.objectFit = 'cover';
      profileCover.appendChild(img);
    }
    
    // Adiciona o overlay
    const overlay = document.createElement('div');
    overlay.className = 'profile-cover-overlay';
    profileCover.appendChild(overlay);
  }
  
  function saveBackground(background) {
    localStorage.setItem('profileBackground', JSON.stringify(background));
  }
}

function setupProfilePic() {
  const profilePicInput = document.getElementById('profile-pic-input');
  const editPicBtn = document.querySelector('.edit-pic-btn');
  const profilePic = document.getElementById('profile-pic');
  
  if (!editPicBtn || !profilePicInput || !profilePic) return;
  
  editPicBtn.addEventListener('click', () => {
    profilePicInput.click();
  });
  
  profilePicInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
          profilePic.src = event.target.result;
          localStorage.setItem('profilePic', event.target.result);
        };
        
        reader.readAsDataURL(file);
      } else {
        alert('Por favor, selecione uma imagem válida.');
      }
    }
  });
}

window.addEventListener('offline', () => {
    window.location.href = 'offline.html';
});