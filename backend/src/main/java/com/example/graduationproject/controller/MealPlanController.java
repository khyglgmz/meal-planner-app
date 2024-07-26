package com.example.graduationproject.controller;

import com.example.graduationproject.dataTransferObjects.DtoMealPlan;
import com.example.graduationproject.entities.Meal;
import com.example.graduationproject.entities.MealPlan;
import com.example.graduationproject.entities.UserDetail;
import com.example.graduationproject.repository.UserDetailRepository;
import com.example.graduationproject.service.MealPlanService;
import com.example.graduationproject.service.UserDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/meal-plan")
public class MealPlanController {
    private final MealPlanService mealPlanService;
    private final UserDetailService userDetailService;
    private final UserDetailRepository userDetailRepository;


    public MealPlanController(MealPlanService mealPlanService, UserDetailService userDetailService, UserDetailRepository userDetailRepository) {
        this.mealPlanService = mealPlanService;
        this.userDetailService = userDetailService;
        this.userDetailRepository = userDetailRepository;
    }


    @PostMapping(value = "/create")
    public MealPlan createMealPlan(@RequestBody DtoMealPlan dtoMealPlan) {
        return mealPlanService.createMealPlan(dtoMealPlan);
    }
    @GetMapping(value = "/get")
    public List<MealPlan> getAllMealPlan() {
        return mealPlanService.getAllMealPlan();
    }
    @GetMapping(value = "/get/{mealPlanId}")
    public Optional<MealPlan> getMealPlanById(@PathVariable Integer mealPlanId) {
        return mealPlanService.getMealPlanById(mealPlanId);
    }
    @DeleteMapping(value = "/delete")
    public void deleteMealPlanById(@PathVariable Integer mealPlanId) {
        mealPlanService.deleteMealPlanById(mealPlanId);
    }
    @PutMapping(value = "/update/{mealPlanId}")
    public MealPlan updateMealPlan(@PathVariable Integer mealPlanId, @RequestBody DtoMealPlan dtoMealPlan) {
        return mealPlanService.updateMealPlan(mealPlanId, dtoMealPlan);
    }
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateMealPlan(@RequestBody DtoMealPlan dtoMealPlan) {
        UserDetail userDetail = userDetailRepository.findById(dtoMealPlan.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Date startDate = dtoMealPlan.getStartDate();
        if (startDate == null) {
            throw new IllegalArgumentException("Start date must be provided");
        }

        Map<String, Object> mealPlanData = mealPlanService.generateMealPlan(userDetail, startDate);
        return ResponseEntity.ok(mealPlanData);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<MealPlan>> getMealPlansByUserId(@PathVariable Integer userId) {
        UserDetail userDetail = userDetailService.findById(userId);

        if (userDetail == null) {
            return ResponseEntity.notFound().build();
        }

        List<MealPlan> mealPlans = mealPlanService.findMealPlansByUserDetail(userDetail);
        return ResponseEntity.ok(mealPlans);
    }
    @GetMapping("/user/{userId}/day/{day}")
    public ResponseEntity<List<MealPlan>> getMealPlanForDay(@PathVariable Integer userId, @PathVariable Integer day) {
        List<MealPlan> mealPlans = mealPlanService.findMealPlansForDay(userId, day);
        return ResponseEntity.ok(mealPlans);
    }


}
