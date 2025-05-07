package com.example.demo.domains.product.repository;

import com.example.demo.domains.product.entity.Product;
import com.example.demo.domains.product.entity.RawMaterial;
import com.example.demo.domains.product.repository.querydsl.customs.RawMaterialRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * author : 윤다희
 * date : 2024-09-24
 * description : 원료 레포지토리
 * 요약 :
 * <p>
 * ===========================================================
 * DATE            AUTHOR             NOTE
 * —————————————————————————————
 * 2024-09-24         윤다희          최초 생성
 */

public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> , RawMaterialRepositoryCustom {

    List<RawMaterial> findByProduct(Product product);
}
