package com.back.domain.notification.repository;

import com.back.domain.notification.dto.NotificationResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SseEmitterRepository {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter add(SseEmitter emitter) {
        this.emitters.add(emitter);
        return emitter;
    }

    public void sendNotification(NotificationResponse response) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("newOrder")
                        .data(response));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }

    public void remove(SseEmitter emitter) {
        this.emitters.remove(emitter);
    }
}