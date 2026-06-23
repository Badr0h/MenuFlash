package com.example.backend.service;

import com.example.backend.domain.model.Product;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Long id);
    Product createProduct(Product product);
    Product updateProduct(Long id, Product productDetails);
    void deleteProduct(Long id);
    Product updateAvailability(Long id, boolean isAvailable);
}
