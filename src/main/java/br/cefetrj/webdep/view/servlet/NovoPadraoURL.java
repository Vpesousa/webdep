/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetrj.webdep.view.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import br.cefetrj.webdep.model.dao.GenericDAO;
import br.cefetrj.webdep.model.dao.PersistenceManager;
import br.cefetrj.webdep.model.entity.PadraoURL;
import br.cefetrj.webdep.model.entity.RegistroLogAcesso;
import br.cefetrj.webdep.model.entity.Usuario;

/**
 *
 * @author Luan
 */
@WebServlet("/NovoPadraoURL")
public class NovoPadraoURL extends HttpServlet {

    /*protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        RequestDispatcher dispatcher = getServletContext().getRequestDispatcher("/gerenciadorsistema.jsp");
        dispatcher.forward(request,response);
    }*/

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
       //processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter pw = response.getWriter();
        HttpSession session = request.getSession();  
        Long usuario_id;
        Usuario usuarioLogado = new Usuario();
    	usuarioLogado.setId(0L);
        PersistenceManager pm = PersistenceManager.getInstance();
        GenericDAO<RegistroLogAcesso> regLogAcessoDAO = pm.createGenericDAO(RegistroLogAcesso.class);
        GenericDAO<Usuario> usuarioDAO = pm.createGenericDAO(Usuario.class);
        GenericDAO<PadraoURL> padraoURLDAO = pm.createGenericDAO(PadraoURL.class);
        List<Usuario> usuarios = usuarioDAO.listAll();
        if (session != null) {
        	usuario_id = (Long)session.getAttribute("name"); //alterar atributo name para o atributo que o outro grupo utilizar
        	for (Usuario u: usuarios) {
        		if (u.getId() == usuario_id) {
        			usuarioLogado = u;
        		}
        	}
        }
        List<RegistroLogAcesso> registrosLogAcesso = regLogAcessoDAO.listAll();
        List<RegistroLogAcesso> registrosLogAcessoPermitidos = new ArrayList<>();
        for (RegistroLogAcesso r : registrosLogAcesso) {
        	if (r.getUsuario().getId() == usuarioLogado.getId()){
        		registrosLogAcessoPermitidos.add(r);
        	}
        }
        //retrieving URL Pattern form fields
        String action = request.getParameter("action");
        String nome = request.getParameter("nome");
        String regex = request.getParameter("regex");
        //validating form
        if ("salvarPadrao".equals(action)) {
            String erro_json = "{ \"Erro\": [";
            boolean erro = false;
            if (regex.trim().isEmpty()){
                erro_json += "\"regex\",";
                erro = true;
                pw.write("");
            }
            if (nome.trim().isEmpty()){
                erro_json += "\"nome\",";
                erro = true;
                pw.write("");
            }
            erro_json += "]}";
            erro_json = erro_json.replace(",]}","]}");
            if (erro) pw.write(erro_json);
            else {
                PadraoURL padraoURL = new PadraoURL();
                padraoURL.setNome(nome);
                padraoURL.setExpressaoRegular(regex);
                padraoURL.setUsuario(usuarioLogado); // usuario logado quem �?
                padraoURLDAO.insert(padraoURL);
                pw.write("success");
            }
        } else if ("buscaRegex".equals(action)) {
            
            String json = "";
            response.setContentType("text/plain");
            try{
                Pattern p = Pattern.compile(regex);
                    /*Aqui utiliza-se o DAO do outro grupo que est� respons�vel por guardar as URLs no banco.
                    A inten��o � pegar todas as URLs do banco:*/
                List<String> URLsRegex = new ArrayList<String>();
                for (RegistroLogAcesso registroLogAcesso: registrosLogAcessoPermitidos){
                	//depois que descobrir quem � o usu�rio logado.. 
                	//verificar permiss�o para ver registros de log de acesso
                	String url = registroLogAcesso.getUrl();
                	Matcher m = p.matcher(url);
                	if (m.matches()) URLsRegex.add(url);
            	}
                //Transformar as URLs filtradas em JSON pra mandar de volta 
                //pra p�gina
                json = "{\"url\": [";
                for (String url: URLsRegex){
                    json += "\"";
                    json += url; //talvez tenha que add um "/" no inicio
                    json += "\", ";
                }
                json += "]}";
                json = json.replace(",]}", "]}");
                pw.write(json);
            }catch(Exception e){
                
            }
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
