package com.example.backend.security;

import com.example.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class PaywallFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        String path = request.getServletPath();
        
        // On laisse passer les routes publiques et d'authentification
        if (path.startsWith("/api/auth/") || !path.startsWith("/api/v1/")) {
            filterChain.doFilter(request, response);
            return;
        }

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            var user = userRepository.findByEmail(email).orElse(null);
            
            // Si l'utilisateur est un ADMIN et qu'il n'a pas payé
            if (user != null && "ADMIN".equals(user.getRole().name()) && !user.isPaid()) {
                String method = request.getMethod();
                
                // On autorise les lectures (GET) pour le mode Freemium
                if ("GET".equalsIgnoreCase(method)) {
                    filterChain.doFilter(request, response);
                    return;
                }

                // On bloque les modifications (POST, PUT, PATCH, DELETE)
                System.out.println("ACTION BLOQUÉE (PAYWALL) POUR : " + email + " SUR " + path + " [" + method + "]");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\": \"Abonnement Premium requis pour effectuer des modifications.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
