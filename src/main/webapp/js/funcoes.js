$(document).ready(function () {
	/*LISTAGEM DE SISTEMA*/
	$("#buscar-sistemas").click(function () {
		var filtro = $("#filtro-busca-sistemas").val();
		//validação form
		if (filtro.trim() === ""){
			$("#div-buscar-sistemas").toggleClass("has-error");
		} else {
			$.ajax({
                type: "POST",
                url: "GerenciadorSistema",
                data: {
                    action: "buscaSistema",
                    filtro: filtro
                },
                success: function (response) {
                    if (response.indexOf("sistemas") > -1) {
                        var sistemas = JSON.parse(response).sistemas;
                        sistemas.forEach(function (el) {
                        	$("#table-url").append("<tr><td>" 
                        			+ el.nome + "</td><td>" 
                        			+ el.servidor + "</td><td>" 
                        			+ el.formatolog + "</td><td>" 
                        			+ el.periodicidade + "</td><td>" 
                        			+ el.proximaleitura + "</td>" +
                        					"<td><a id=\""+ el.nome +"-alterar\" class=\"alterar-sistema\">Alterar</a></td>" +
                        					"<td><a id=\""+ el.nome +"-excluir\" class=\"excluir-sistema\">Excluir</a></td></tr>");
                        });
                        refresh = false;
                        
                    } else if (response.indexOf("Erro")) {

                    }
                }
            });
		}
	});
	/*FIM LISTAGEM DE SISTEMA*/
	
	  $("#excluir-sistemas").click(function () {
          var filtro = $("#filtro-excluir-sistemas").val();
          //validação form
          if (filtro.trim() === ""){
              $("#div-excluir-sistemas").toggleClass("has-error");
          } else {
              decisao = confirm("Tem certeza que deseja excluir o sistema?\nTodos os registros de logs serão apagados.");
              if(decisao){
              $.ajax({
                      type: "POST",
                       url: "GerenciadorSistema",
                      data: {
                      action: "excluirSistema",
                      filtro: filtro
                  },
                  success: function (response) {
                      if (response.indexOf("sistemas") > -1) {
                          var sistemas = JSON.parse(response).sistemas;
                          sistemas.forEach(function (el) {
                              $("#table-url").append("<tr><td>"
                                      + el.nome + "</td><td>"
                                      + el.servidor + "</td><td>"
                                      + el.formatolog + "</td><td>"
                                      + el.periodicidade + "</td><td>"
                                      + el.proximaleitura + "</td>" +
                                              "<td><a id=\""+ el.nome +"-alterar\" class=\"alterar-sistema\">Alterar</a></td>" +
                                              "<td><a id=\""+ el.nome +"-excluir\" class=\"excluir-sistema\">Excluir</a></td></tr>");
                          });
                          refresh = false;
                         
                      } else if (response.indexOf("Erro")) {
                      }
                  }
              });
              }
          }
      });
	
	
	/* MODAL PADRAO URL*/
	//abrir modal Novo Padrão de URL
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').focus();
    });
    //Buscar Expressão Regular
    $("#submit-regex").click(function () {
        var regex = $("#regex").val();
        if (regex.trim() === "") {
            $("#div-regex").toggleClass("has-error");
        } else {
            $("#div-regex").removeClass("has-error");
            $.ajax({
                type: "POST",
                url: "PadraoURL",
                data: {
                    action: "buscaRegex",
                    regex: regex
                },
                success: function (response) {
                    if (response.indexOf("url") > -1) {
                        var urls = JSON.parse(response).url;
                        urls.forEach(function (el) {
                            $("#table-url").append("<tr><td>" + el + "</td></tr>");
                        });
                        refresh = false;
                    } else if (response.indexOf("Erro")) {

                    }
                }
            });
        }
        return false;
    });
    //Salvar Padrão URL
    $("#submit-padrao-url").click(function () {
        var regex = $("#regex").val();
        var nome = $("#padrao-url-nome").val();
        if (regex.trim() === "")
            $("#div-regex").toggleClass("has-error");
        if (nome.trim() === "")
            $("#div-nome").toggleClass("has-error");
        if (regex.trim() !== "" && nome.trim() !== "") {
            $("#div-regex").removeClass("has-error");
            $("#div-nome").removeClass("has-error");
            $.ajax({
                type: "POST",
                url: "PadraoURL",
                data: {
                    action: "salvarPadrao",
                    nome: nome,
                    regex: regex
                },
                success: function (response) {
                    if (response.indexOf("url") > -1) {
                        var urls = JSON.parse(response).url;
                        console.log(urls);
                        urls.forEach(function (el) {
                            $("#table-url").append("<tr><td>" + el + "</td></tr>");
                        });
                    } else if (response.indexOf("Erro")) {

                    }
                }
            });
        }
        return false;
    });
    /*FIM PADRAO URL*/
    /*DATEPICKER*/ //não é necessário cada grupo colocar os codigos javascript em cada página isoladamente
    $('.form_datetime').datetimepicker({
        language:  'pt-BR',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1
    });
	$('.form_date').datetimepicker({
        language:  'pt-BR',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
    });
	$('.form_time').datetimepicker({
        language:  'pt-BR',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 1,
		minView: 0,
		maxView: 1,
		forceParse: 0
    });
	
	$("#lista-sistemas a").click(function () {
		//saber qual o id do link que foi clickado
		var idLink;
		var sistema_id;
		var acao;
		if (idLink.indexOf("alterar")){
			var sistema_id = idLink.replace("-alterar", "");
		}
		$.ajax({
            type: "POST",
            url: "GerenciadorSistema",
            data: {
            	sistema_id: sistema_id,
            	acao: acao
                //resto dos campos
            },
            success: function (response) {}
            
		});
	});
	
		
	$("#cadastro-sistema-submit").click(function () {
		var nome = $("#nome").val();
		var servidor = $("#selection").val();
		var fmtLogs = $("#fmtLogs").val();
		var ptLogs = $("#ptLogs").val();
		var pxLogs = $("#pxLogs").val();
		var ptLogs2 = $("#ptLogs2").val();
		var pxLogs2 = $("#pxLogs2").val();
		var data = $("#data").val();
		var hora = $("#time").val();
		var nova = $("#novaData").val();
	
		//validação form
		if (nome.trim() === ""){
			$("#nome").toggleClass("has-error");
		} 
		if (data.trim() === ""){
			$("#data").toggleClass("has-error");
		}
		if (hora.trim() === ""){
			$("#time").toggleClass("has-error");
		}
		if (nome.trim() === ""){
			$("#novaData").toggleClass("has-error");
		}
		else {
			$.ajax({
	            type: "POST",
	            url: "CadastroSistema",
	            data: {
	                nome: nome,
	                servidor: servidor,
	                formatoLogs: fmtLogs,
	                pastaLogs: ptLogs,
	                prefixoLogs: pxLogs,
	                pastaLogs2: ptLogs2,
	                prefixoLogs2: pxLogs2,
	                data: data,
	                hora: hora,
	                nova: nova
	            },
	            success: function (response) {
	                if (response.indexOf("mensagem") > -1) {
	                    var mensagem = JSON.parse(response).mensagem;
	                    $("#mensagem").val(mensagem);
	                }
                        
                } 

                    
            });
          }
	});
		
});

