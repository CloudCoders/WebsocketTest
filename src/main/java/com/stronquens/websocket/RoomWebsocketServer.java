/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.stronquens.websocket;

import com.stronquens.handlers.RoomSessionHandler;
import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author stronquens
 */
@ApplicationScoped
@ServerEndpoint("/rooms")
public class RoomWebsocketServer {

    @Inject
    private RoomSessionHandler roomSessionHandler;

    @OnOpen
    public void open(Session session) {
        roomSessionHandler.getIdSesion(session);
    }

    @OnClose
    public void close(Session session) {
        roomSessionHandler.deleteRoom(session.getId());
    }

    @OnError
    public void onError(Throwable error) {
        Logger.getLogger(RoomWebsocketServer.class.getName()).log(Level.SEVERE, null, error);
    }

    @OnMessage
    public void handleMessage(String message, Session session) {
        try (JsonReader reader = Json.createReader(new StringReader(message))) {
            JsonObject jsonMessage = reader.readObject();

            if ("createRoom".equals(jsonMessage.getString("action"))) {
                roomSessionHandler.createRoom(session);
            }

            if ("joinRoom".equals(jsonMessage.getString("action"))) {
                String idRoom = jsonMessage.getString("idRoom");
                roomSessionHandler.addControllerToRoom(session, idRoom);
            }

            if ("buttonPressed".equals(jsonMessage.getString("action"))) {
                String idRoom = jsonMessage.getString("idRoom");
                String button = jsonMessage.getString("button");
                roomSessionHandler.sendEventToRoom(session.getId(), idRoom, button);
            }
        }
    }
}
