/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.stronquens.websocket;

/**
 *
 * @author stronquens
 */
import javax.enterprise.context.ApplicationScoped;
import java.util.HashSet;
import javax.websocket.Session;
import com.stronquens.model.Device;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;

@ApplicationScoped
public class DeviceSessionHandler {

    private int deviceId = 0;
    private final HashSet<Session> sessions = new HashSet<Session>();
    private final HashSet<Device> devices = new HashSet<Device>();

    public void addSession(Session session) {
        sessions.add(session);
        for (Device device : devices) {
            JsonObject addMessage = createAddMessage(device);
            sendToSession(session, addMessage);
        }
    }

    public void removeSession(Session session) {
        sessions.remove(session);
    }

    public List getDevices() {
        return new ArrayList<>(devices);
    }

    public void addDevice(Device device) {
        device.setId(deviceId);
        devices.add(device);
        deviceId++;
        JsonObject addMessage = createAddMessage(device);
        sendToAllConnectedSessions(addMessage);
    }

    public void removeDevice(int id) {
        Device device = getDeviceById(id);
        if (device != null) {
            devices.remove(device);
            JsonProvider provider = JsonProvider.provider();
            JsonObject removeMessage = provider.createObjectBuilder()
                    .add("action", "remove")
                    .add("id", id)
                    .build();
            sendToAllConnectedSessions(removeMessage);
        }
    }

    private Device getDeviceById(int id) {
        for (Device device : devices) {
            if (device.getId() == id) {
                return device;
            }
        }
        return null;
    }

    private JsonObject createAddMessage(Device device) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject addMessage = provider.createObjectBuilder()
                .add("action", "add")
                .add("id", device.getId())
                .add("name", device.getName())
                .add("type", device.getType())
                .add("description", device.getDescription())
                .build();
        return addMessage;
    }

    private void sendToAllConnectedSessions(JsonObject message) {
        for (Session session : sessions) {
            sendToSession(session, message);
        }
    }

    private void sendToSession(Session session, JsonObject message) {
        try {
            session.getBasicRemote().sendText(message.toString());
        } catch (IOException ex) {
            sessions.remove(session);
            Logger.getLogger(DeviceSessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
