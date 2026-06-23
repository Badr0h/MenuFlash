package com.example.backend.controller;

import com.example.backend.domain.model.GlobalImage;
import com.example.backend.repository.GlobalImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/images/generic")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS}, allowCredentials = "true")
public class GlobalImageController {

    private final GlobalImageRepository globalImageRepository;

    @GetMapping
    public ResponseEntity<List<GlobalImage>> getGenericImages() {
        return ResponseEntity.ok(globalImageRepository.findAll());
    }
}
