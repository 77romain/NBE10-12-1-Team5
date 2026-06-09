package com.back.domain.notification.controller;

import com.back.domain.notification.repository.SseEmitterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final SseEmitterRepository sseEmitters;

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {

        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);

        sseEmitters.add(emitter);

        emitter.onTimeout(() -> {
            sseEmitters.remove(emitter);
        });

        emitter.onCompletion(() -> {
            sseEmitters.remove(emitter);
        });

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
        } catch (IOException e) {
            sseEmitters.remove(emitter);
            throw new RuntimeException(e);
        }

        return emitter;
    }
}