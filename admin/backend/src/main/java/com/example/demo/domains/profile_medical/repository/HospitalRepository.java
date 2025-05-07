package com.example.demo.domains.profile_medical.repository;

import com.example.demo.domains.profile_medical.entity.Hospital;
import com.example.demo.domains.profile_medical.repository.querydsl.customs.HospitalRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * author : 최혜령
 * date : 2024-09-24
 * description : 병원 JPA 레포지토리
 * <p>
 * ===========================================================
 * DATE            AUTHOR             NOTE
 * —————————————————————————————
 * 2024-09-24         최혜령          최초 생성
 */
public interface HospitalRepository extends JpaRepository<Hospital, Long>, HospitalRepositoryCustom {

}
