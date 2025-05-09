package com.example.demo.domains.disease.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MedicalDiseaseDTO {
    private Long id; // MedicalDisease ID
    private String diseaseName; // 병명
    private String diseaseSubCategory; // 병명 소분류
    private String progressStatus; // 진행 상태 (T: 진행 중, F: 완료됨)
    private Date diagnosisDate; // 진단 날짜
}
