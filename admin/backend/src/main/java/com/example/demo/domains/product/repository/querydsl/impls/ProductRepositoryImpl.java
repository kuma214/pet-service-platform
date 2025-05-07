package com.example.demo.domains.product.repository.querydsl.impls;

import com.example.demo.domains.product.entity.Product;
import com.example.demo.domains.product.repository.ProductRepository;
import com.example.demo.domains.product.repository.querydsl.customs.ProductRepositoryCustom;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * author : 윤다희
 * date : 2024-09-24
 * description : 상품 레포지토리 구현
 * 요약 :
 * <p>
 * ===========================================================
 * DATE            AUTHOR             NOTE
 * —————————————————————————————
 * 2024-09-24         윤다희          최초 생성
 */

@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepositoryCustom {

    private final EntityManager em;

    @Override
    public List<Product> findAllByType(String type) {
        String jpql = "select p from Product p where p.type = :type";
        return em.createQuery(jpql, Product.class)
                .setParameter("type", type)
                .getResultList();
    }
}
