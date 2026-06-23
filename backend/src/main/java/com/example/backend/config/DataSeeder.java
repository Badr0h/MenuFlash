package com.example.backend.config;

import com.example.backend.domain.model.GlobalImage;
import com.example.backend.repository.GlobalImageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedGlobalImages(GlobalImageRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(Arrays.asList(
                    // --- COFFEES ---
                    GlobalImage.builder().name("Espresso Classic").category("Coffee").imageUrl("https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&q=80&w=800").build(),
                    GlobalImage.builder().name("Cappuccino Art").category("Coffee").imageUrl("https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=800").build(),
                    GlobalImage.builder().name("Latte Macchiato").category("Coffee").imageUrl("https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=800").build(),
                    GlobalImage.builder().name("Iced Coffee").category("Coffee").imageUrl("https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800").build(),
                    
                    // --- TEAS ---
                    GlobalImage.builder().name("Moroccan Mint Tea").category("Tea").imageUrl("https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800").build(),
                    GlobalImage.builder().name("Green Tea").category("Tea").imageUrl("https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=800").build(),
                    
                    // --- JUICES & SOFT DRINKS ---
                    GlobalImage.builder().name("Jus d'Orange Frais").category("Soft Drink").imageUrl("https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800").build(),
                    GlobalImage.builder().name("Soda Canette").category("Soft Drink").imageUrl("https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800").build(),
                    
                    // --- MEALS (NEW) ---
                    GlobalImage.builder().name("Burger Gourmet").category("Meal").imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800").build(),
                    GlobalImage.builder().name("Pizza Margherita").category("Meal").imageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800").build(),
                    GlobalImage.builder().name("Tacos Poulet").category("Meal").imageUrl("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800").build(),
                    GlobalImage.builder().name("Salade César").category("Meal").imageUrl("https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800").build(),
                    
                    // --- DESSERTS (NEW) ---
                    GlobalImage.builder().name("Cheesecake").category("Dessert").imageUrl("https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800").build(),
                    GlobalImage.builder().name("Tiramisu").category("Dessert").imageUrl("https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800").build()
                ));
            }
        };
    }
}
