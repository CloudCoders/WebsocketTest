package com.stronquens.handlers;

import com.stronquens.model.RoomBean;
import java.io.IOException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import javax.websocket.Session;

/**
 * Gestor de las diferentes salas/partidas que se estan jugando al mismo tiempo.
 * Gestiona los mensajes que se envian dentro de las salas.
 *
 * @author stronquens
 */
@ApplicationScoped
public class RoomSessionHandler {

    // Array con las salas que estan activas cuyo String de acceso es el Id de la sesion
    private final HashMap<String, RoomBean> rooms = new HashMap<String, RoomBean>();
    //Necesario para crear objetos json para mensajes
    private JsonProvider provider = JsonProvider.provider();

    // Crea una nueva sala/partida y la añade al array de salas activas
    public void createRoom(Session session) {
        rooms.put(session.getId(), new RoomBean(session));
        // Debug 
        System.out.println("Room created with id: " + session.getId() + " roomsLength: " + rooms.size());
    }

    /**
     * Borra una salsa/partida ya concluida del array de salas activas
     *
     * @param idSession
     */
    public void deleteRoom(String idSession) {
        rooms.remove(idSession);
        // Debug
        System.out.println("Room deleted with id: " + idSession + " roomsLength: " + rooms.size());

    }

    /**
     * Añade un mando a una sala/partida
     *
     * @param sController Sesion del mando que se guarda en la partida
     * @param idRoom Identificador de la partida
     */
    public void addControllerToRoom(Session sController, String idRoom) {
        RoomBean room = rooms.get(idRoom);
        room.addController(sController);
        JsonObject message = provider.createObjectBuilder()
                .add("action", "controllerId")
                .add("controllerId", sController.getId())
                .add("name", "Jugador" + room.getNumControllers())
                .build();
        sendToSession(room.getTv(), message);
    }

    /**
     * Devuelve a una sesion su propio Id de sesion asignado
     *
     * @param session
     */
    public void getIdSession(Session session) {
        JsonObject message = provider.createObjectBuilder()
                .add("action", "sessionId")
                .add("sessionId", session.getId())
                .build();
        sendToSession(session, message);
    }

    /**
     * Notifica a la tv que boton ha sido pulsado por un mando
     *
     * @param idController Identificador del mando que ha pulsado boton
     * @param idRoom Identificador de sala/partida
     * @param button Boton pulsado
     */
    public void sendButtonPressedToTv(String idController, String idRoom, String button) {
        Session tv = rooms.get(idRoom).getTv();
        JsonObject message = provider.createObjectBuilder()
                .add("action", "buttonPressed")
                .add("sessionId", idController)
                .add("button", button)
                .build();
        sendToSession(tv, message);
    }

    /**
     * Envia mensajes a una sesion
     *
     * @param session a la que se le envia el mensaje
     * @param message
     */
    private void sendToSession(Session session, JsonObject message) {
        try {
            session.getBasicRemote().sendText(message.toString());
        } catch (IOException ex) {
            //sessions.remove(session);
            Logger.getLogger(RoomSessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
