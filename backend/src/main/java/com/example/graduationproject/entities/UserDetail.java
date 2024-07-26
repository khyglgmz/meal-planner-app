    package com.example.graduationproject.entities;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import com.fasterxml.jackson.annotation.JsonProperty;
    import jakarta.persistence.*;
    import lombok.*;
    import org.springframework.security.core.GrantedAuthority;
    import org.springframework.security.core.authority.SimpleGrantedAuthority;
    import org.springframework.security.core.userdetails.UserDetails;

    import java.util.Collection;
    import java.util.HashSet;
    import java.util.List;
    import java.util.Set;

    @Entity
    @Builder
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public class UserDetail implements UserDetails {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Integer userId;

        @Column()
        @JsonProperty("username")
        String username;

        @JsonProperty("password")
        @Column()
        String password;

        @Column()
        String email;

        String firstName;
        String lastName;
        String profileImage;
        String gender;//string mi bakacagım
        boolean isEmailVerified = false;//doing it false first because , want user to verify its account before using it

        @OneToOne(mappedBy = "userDetail", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @JsonBackReference("userDetail-userProfile")
        private UserProfile userProfile;

        @OneToMany(mappedBy = "userDetail", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @JsonManagedReference("userDetail-favorites")
        private Set<UserFavorites> favorites = new HashSet<>();

        @OneToMany(mappedBy = "userDetail", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @JsonManagedReference("userDetail-mealPlans")
        private List<MealPlan> mealPlans;

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return null;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }
    }
