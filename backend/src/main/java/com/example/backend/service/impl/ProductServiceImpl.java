package com.example.backend.service.impl;

import com.example.backend.domain.model.Product;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    @Transactional
    public Product createProduct(Product product) {
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
        
        if (productDetails.getCategory() != null && !productDetails.getCategory().isBlank()) {
            product.setCategory(productDetails.getCategory());
        }
        
        product.setAvailable(productDetails.isAvailable());
        
        return productRepository.save(product);
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

    @Override
    public List<Product> getProductsByCategoryAndAvailability(String category, boolean isAvailable) {
        return productRepository.findByCategoryAndIsAvailable(category, isAvailable);
    }
}
