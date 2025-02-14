package com.chillin.hearting.db.repository;

import com.chillin.hearting.api.data.HeartConditionDTO;
import com.chillin.hearting.api.data.HeartCountDTO;
import com.chillin.hearting.db.domain.Heart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HeartRepository extends JpaRepository<Heart, Long> {

    public List<Heart> findAllByType(String default_type);

}

