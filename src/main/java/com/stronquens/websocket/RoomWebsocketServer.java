package com.stronquens.websocket;

import com.stronquens.routes.ParamRoutes;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
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
        paramRoutes.execute("{\"action\":\"disconnect\"}", session);
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
