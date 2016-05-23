/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.stronquens.websocket;

import com.stronquens.handlers.RoomSessionHandler;
import com.stronquens.routes.ParamRoutes;
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
    private ParamRoutes paramRoutes;

    @OnOpen
    public void open(Session session) {
        paramRoutes.execute("{\"action\":\"idSession\"}", session);
    }

    @OnClose
    public void close(Session session) {
        paramRoutes.execute("{\"action\":\"desconnect\"}", session);
    }

    @OnError
    public void onError(Throwable error) {
        Logger.getLogger(RoomWebsocketServer.class.getName()).log(Level.SEVERE, null, error);
    }

    @OnMessage
    public void handleMessage(String message, Session session) {
        paramRoutes.execute(message, session);
    }
}
