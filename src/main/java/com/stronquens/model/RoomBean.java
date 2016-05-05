/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.stronquens.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import javax.websocket.Session;

/**
 *
 * @author stronquens
 */
public class RoomBean {

    private Session tv = null;
    private ArrayList<Session> controllers = new ArrayList<Session>();
    private JsonProvider provider = JsonProvider.provider();
    
    public RoomBean(Session tv) {
        this.tv = tv;
    }

    public void addController(Session session) {
        controllers.add(session);       
        JsonObject message = provider.createObjectBuilder()
                .add("action", "controllerId")
                .add("controllerId", session.getId())
                .add("name", "Jugador"+controllers.size())
                .build();
        sendToTv(message);
    }

    public Session getController(Session sesion) {
        Session controller = null;
        for (Session ct : controllers) {
            if (ct.getId().equalsIgnoreCase(sesion.getId())) {
                controller = ct;
                break;
            }
        }
        return controller;
    }

    public void removeController(Session sesion) {
        controllers.remove(sesion);
    }

    public Session getTv() {
        return tv;
    }

    private void sendToTv(JsonObject message) {
        try {
            tv.getBasicRemote().sendText(message.toString());
        } catch (IOException ex) {
            Logger.getLogger(RoomBean.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
