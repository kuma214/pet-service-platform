package com.example.demo.domains.profile_medical.service.impls;

import com.example.demo.domains.profile_medical.dto.HospitalDTO;
import com.example.demo.domains.profile_medical.entity.Hospital;
import com.example.demo.domains.profile_medical.repository.HospitalRepository;
import com.example.demo.domains.profile_medical.service.interfaces.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * author : 최혜령
 * date : 2024-09-24
 * description : 병원 서비스 구현 클래스
 * <p>
 * ===========================================================
 * DATE            AUTHOR             NOTE
 * —————————————————————————————
 * 2024-09-24         최혜령          최초 생성
 */
@Service
@RequiredArgsConstructor
public class HospitalServiceImpl implements HospitalService {
    private final HospitalRepository hospitalRepository;

    @Override
    public Hospital saveFromUser(Long reg_num, String name, String doctorName, String address) {
        Optional<Hospital> h = hospitalRepository.findById(reg_num);
        if (!h.isPresent()) {
            Hospital hospital = new Hospital();
            hospital.setId(reg_num);
            hospital.setName(name);
            hospital.setDoctor(doctorName);
            hospital.setAddress(address);
            hospital.setIs_ours("F");
            return hospitalRepository.save(hospital);
        } else {
            return h.get();
        }
    }

    @Override
    public Hospital saveByAdmin(Long reg_num, String name, String doctorName, String address, String phonNum, String isOurs) {
        Optional<Hospital> h = hospitalRepository.findById(reg_num);
        if (!h.isPresent()) {
            Hospital hospital = new Hospital();
            hospital.setId(reg_num);
            hospital.setName(name);
            hospital.setDoctor(doctorName);
            hospital.setAddress(address);
            hospital.setPhone_number(phonNum);
            hospital.setIs_ours(isOurs);
            return hospitalRepository.save(hospital);
        } else {
            return null;
        }
    }

    @Override
    public Boolean delete(Hospital hospital) {
        try{
            hospitalRepository.delete(hospital);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<Hospital> getAll() {
        return hospitalRepository.findAll();
    }

    @Override
    public List<Hospital> getOurHospitalsByCurrentLocation(String location) {
        return hospitalRepository.findOurHospitalsByCurrentLocation(location);
    }

    @Override
    public List<Hospital> getAllOurHospitals() {
        return hospitalRepository.findOurHospitals();
    }

    public Hospital getHospitalById(Long reg_num) {
        return hospitalRepository.findById(reg_num).get();
    }

    @Override
    public List<HospitalDTO> getAffiliatedFacilities() {
        return hospitalRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private HospitalDTO convertToDTO(Hospital hospital) {
        HospitalDTO dto = new HospitalDTO();
        dto.setId(hospital.getId());
        dto.setName(hospital.getName());
        dto.setAddress(hospital.getAddress());
        dto.setDoctor(hospital.getDoctor());
        dto.setPhoneNumber(hospital.getPhone_number()); // 메서드명을 엔티티에 맞게 수정
        dto.setIsOurs(hospital.getIs_ours().equalsIgnoreCase("T")); // 제휴 여부를 T/F로 저장한다면 변환
        return dto;
    }
}
