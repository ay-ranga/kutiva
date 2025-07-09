        $(document).ready(function() {
          // Inicializa o datepicker
          $("#birthDate").datepicker({
            dateFormat: 'dd/mm/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:' + new Date().getFullYear(),
            maxDate: new Date(),
            showAnim: 'fadeIn',
            beforeShow: function(input, inst) {
              setTimeout(function() {
                inst.dpDiv.css({
                  'margin-top': '10px',
                  'border-radius': '10px',
                  'box-shadow': '0 5px 20px rgba(0, 0, 0, 0.2)'
                });
              }, 0);
            }
          });
          
          // Abre o datepicker ao clicar no ícone do calendário
          $("#calendarIcon").click(function() {
            $("#birthDate").datepicker("show");
          });
          
          // Preview da imagem de perfil
          $("#profileUpload").change(function(e) {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = function(event) {
                $("#profileImg").attr("src", event.target.result);
              }
              reader.readAsDataURL(file);
            }
          });
          
          // Validação do formulário
          $("#registerForm").submit(function(e) {
            e.preventDefault();
            
            // Validação básica
            const fullName = $("#fullName").val().trim();
            const birthDate = $("#birthDate").val();
            const gender = $("#gender").val();
            const classValue = $("#class").val();
            const terms = $("#terms").is(":checked");
            
            if (!fullName || !birthDate || !gender || !classValue || !terms) {
              alert("Por favor, preencha todos os campos obrigatórios.");
              return;
            }
            
            // Simulação de envio do formulário
            alert("Cadastro realizado com sucesso!\n\nNome: " + fullName + "\nData de Nascimento: " + birthDate +
              "\nGênero: " + $("#gender option:selected").text() + "\nClasse: " + $("#class option:selected").text());
            
            // Redireciona para biblioteca.html após o alerta
            window.location.href = "biblioteca.html";
            
            // Aqui você pode adicionar o código para enviar os dados para o servidor
            // Exemplo: $.post("/register", $(this).serialize(), function(response) { ... });
          });
          
          // Botão voltar
          $("#backBtn").click(function() {
            window.history.back();
          });
        });