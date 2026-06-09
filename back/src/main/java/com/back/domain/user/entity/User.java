package com.back.domain.user.entity;

import com.back.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "users")
public class User extends BaseEntity {

    @Column(unique = true)
    private String email;

    @Column
    private String pastEmail;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String addressDetail;

    @Column(nullable = false)
    private String postcode;

    @Builder
    public User(String email, String address, String addressDetail, String postcode) {
        this.email = email;
        this.address = address;
        this.addressDetail = addressDetail;
        this.postcode = postcode;
    }

    public void update(String email, String address, String addressDetail, String postcode) {
        this.email = email;
        this.address = address;
        this.addressDetail = addressDetail;
        this.postcode = postcode;
    }

    public void delete() {
        this.pastEmail = this.email;
        this.email = null;
        softDelete();
    }
}