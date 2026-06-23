package com.example.backend.service.impl;

import com.example.backend.domain.model.GlobalImage;
import com.example.backend.domain.model.Product;
import com.example.backend.domain.model.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.GlobalImageRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final GlobalImageRepository globalImageRepository;
    private final UserRepository userRepository;

    @Override
    public List<Product> getAllProducts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return productRepository.findByUser(user);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    @Transactional
    public Product createProduct(Product product) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        product.setUser(user);
        mapIdsToEntities(product);
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        if (productDetails == null) {
            throw new IllegalArgumentException("Product details cannot be null");
        }

        Product product = getProductById(id);
        
        if (productDetails.getName() != null && !productDetails.getName().isBlank()) {
            product.setName(productDetails.getName());
        }
        
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        
        if (productDetails.getPrice() != null) {
            product.setPrice(productDetails.getPrice());
        }
        
        mapIdsToEntities(productDetails);
        product.setCategory(productDetails.getCategory());
        product.setGenericImage(productDetails.getGenericImage());
        product.setImageUrl(productDetails.getImageUrl());
        
        product.setAvailable(productDetails.isAvailable());
        
        return productRepository.save(product);
    }

    private void mapIdsToEntities(Product product) {
        if (product.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(product.getCategoryId()).orElse(null));
        }
        if (product.getGenericImageId() != null) {
            GlobalImage img = globalImageRepository.findById(product.getGenericImageId()).orElse(null);
            product.setGenericImage(img);
            if (img != null) {
                product.setImageUrl(img.getImageUrl());
            }
        }
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    @Override
    @Transactional
    public Product updateAvailability(Long id, boolean isAvailable) {
        Product product = getProductById(id);
        product.setAvailable(isAvailable);
        return productRepository.save(product);
    }
}
