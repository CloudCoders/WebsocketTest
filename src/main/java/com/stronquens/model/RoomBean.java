/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.stronquens.model;

import java.util.ArrayList;
import javax.websocket.Session;

/**
 * Objeto Sala que relaciona y comunica los mandos con la tv
 *
 * @author stronquens
 */
public class RoomBean {

    // Sesion principal de la tv
    private Session tv = null;
    // Array de mandos conectados a la sala
    private ArrayList<Session> controllers = new ArrayList<Session>();

    /**
     * Constructor que inicializa la sala con la sesion de la tv
     *
     * @param tv
     */
    public RoomBean(Session tv) {
        this.tv = tv;
    }

    /**
     * Devuelve la sesion de la tv
     *
     * @return
     */
    public Session getTv() {
        return tv;
    }

    /**
     * Añade la sesion de un nuevo mando a la sala y avisa a la tv
     *
     * @param session
     */
    public void addController(Session session) {
        controllers.add(session);
    }

    /**
     * Devuelve el numero de mandos conectados
     *
     * @return
     */
    public int getNumControllers() {
        return controllers.size();
    }

    /**
     * Busca si existe un mando en esta sala
     *
     * @param sesion del mando a buscar
     * @return
     */
    public boolean existController(Session sesion) {
        boolean exist = false;
        for (Session ct : controllers) {
            if (ct.getId().equalsIgnoreCase(sesion.getId())) {
                exist = true;
                break;
            }
        }
        return exist;
    }

    /**
     * Elimina un mando de la sala
     *
     * @param sesion mando a eliminar
     */
    public void removeController(Session sesion) {
        controllers.remove(sesion);
    }
}
