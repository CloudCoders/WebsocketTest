/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
 *
 * @author stronquens
 */
@ApplicationScoped
public class RoomSessionHandler {

    private final HashMap<String, RoomBean> rooms = new HashMap<String, RoomBean>();
    private JsonProvider provider = JsonProvider.provider();
    

    public void createRoom(Session session) {
        rooms.put(session.getId(), new RoomBean(session));
        System.out.println("Room created with id: " + session.getId() + " roomsLength: " + rooms.size());
    }

    public void deleteRoom(String idSession) {
        rooms.remove(idSession);
        System.out.println("Room deleted with id: " + idSession + " roomsLength: " + rooms.size());

    }

    public void addControllerToRoom(Session sController, String idRoom) {
        RoomBean room = rooms.get(idRoom);
        room.addController(sController);
    }

    public void getIdSesion(Session session) {
        JsonObject message = provider.createObjectBuilder()
                .add("action", "sessionId")
                .add("sessionId", session.getId())
                .build();
        sendToSession(session, message);
    }

    private void sendToSession(Session session, JsonObject message) {
        try {
            session.getBasicRemote().sendText(message.toString());
        } catch (IOException ex) {
            //sessions.remove(session);
            Logger.getLogger(DeviceSessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
