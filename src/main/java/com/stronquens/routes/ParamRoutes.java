package com.stronquens.routes;

import com.stronquens.handlers.RoomSessionHandler;
import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.websocket.Session;

/**
 *
 * @author stronquens
 */
@ApplicationScoped
public class ParamRoutes {

    @Inject
    private RoomSessionHandler roomSessionHandler;

    /**
     * Redirige las acciones segun el contenido del mensaje recibido
     *
     * @param message
     * @param session
     */
    public void execute(String message, Session session) {
        try {
            JsonReader reader = Json.createReader(new StringReader(message));
            JsonObject jsonMessage = reader.readObject();

            switch (jsonMessage.getString("action")) {
                case "idSession":
                    roomSessionHandler.getIdSession(session);
                    break;
                case "disconnect":
                    roomSessionHandler.deleteRoom(session.getId());
                    break;
                case "createRoom":
                    roomSessionHandler.createRoom(session);
                    break;
                case "joinRoom":
                    String idRoom = jsonMessage.getString("idRoom");
                    roomSessionHandler.addControllerToRoom(session, idRoom);
                    break;
                case "buttonPressed":
                    //String idRoom2 = jsonMessage.getString("idRoom");
                    //String button = jsonMessage.getString("button");
                    roomSessionHandler.sendButtonPressedToTv(session.getId(),
                            jsonMessage.getString("idRoom"), jsonMessage.getString("button"));
                    break;
            }
        } catch (Exception e) {
            Logger.getLogger(ParamRoutes.class.getName()).log(Level.SEVERE, null, e);
        }

    }

}
