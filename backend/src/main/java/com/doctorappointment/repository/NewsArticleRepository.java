package com.doctorappointment.repository;

import com.doctorappointment.model.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    
    @Query("SELECT n FROM NewsArticle n WHERE n.isActive = true AND n.status = 'APPROVED' ORDER BY n.publishedAt DESC")
    List<NewsArticle> findAllActiveOrderByPublishedAtDesc(Pageable pageable);
    
    @Query("SELECT n FROM NewsArticle n WHERE n.isActive = true AND n.isFeatured = true AND n.status = 'APPROVED' ORDER BY n.displayOrder ASC")
    List<NewsArticle> findFeaturedArticles(Pageable pageable);
    
    @Query("SELECT n FROM NewsArticle n WHERE n.slug = ?1 AND n.isActive = true AND n.status = 'APPROVED'")
    Optional<NewsArticle> findBySlugAndIsActiveTrue(String slug);
    
    List<NewsArticle> findByIsActiveTrueOrderByPublishedAtDesc();
    
    // Tìm bài viết theo bác sĩ
    @Query("SELECT n FROM NewsArticle n WHERE n.doctor.id = ?1 AND n.status = 'APPROVED' AND n.isActive = true ORDER BY n.publishedAt DESC")
    List<NewsArticle> findByDoctorIdAndApproved(Long doctorId);
    
    // Tìm tất cả bài viết của bác sĩ (bao gồm pending)
    @Query("SELECT n FROM NewsArticle n WHERE n.doctor.id = ?1 ORDER BY n.publishedAt DESC")
    List<NewsArticle> findByDoctorId(Long doctorId);
    
    // Tìm bài viết pending để admin duyệt
    @Query("SELECT n FROM NewsArticle n WHERE n.status = 'PENDING' ORDER BY n.createdAt DESC")
    List<NewsArticle> findPendingArticles();
    
    // Tìm tất cả bài viết (cho admin)
    @Query("SELECT n FROM NewsArticle n ORDER BY n.createdAt DESC")
    List<NewsArticle> findAllArticles();
    
    // Tìm bài viết theo category
    @Query("SELECT n FROM NewsArticle n WHERE n.category = ?1 AND n.isActive = true AND n.status = 'APPROVED' ORDER BY n.publishedAt DESC")
    List<NewsArticle> findByCategoryAndIsActiveTrueOrderByPublishedAtDesc(String category, Pageable pageable);
    
    // Lấy tất cả categories
    @Query("SELECT DISTINCT n.category FROM NewsArticle n WHERE n.isActive = true AND n.status = 'APPROVED' ORDER BY n.category ASC")
    List<String> findDistinctCategories();
    
    // Tìm bài viết theo section name
    @Query("SELECT n FROM NewsArticle n WHERE n.sectionName = ?1 AND n.isActive = true AND n.status = 'APPROVED' ORDER BY n.publishedAt DESC")
    List<NewsArticle> findBySectionNameAndIsActiveTrueOrderByPublishedAtDesc(String sectionName, Pageable pageable);
    
    // Tìm bài viết theo section name và category
    @Query("SELECT n FROM NewsArticle n WHERE n.sectionName = ?1 AND n.category = ?2 AND n.isActive = true AND n.status = 'APPROVED' ORDER BY n.publishedAt DESC")
    List<NewsArticle> findBySectionNameAndCategoryAndIsActiveTrueOrderByPublishedAtDesc(String sectionName, String category, Pageable pageable);
    
    // Tìm bài viết theo section name và nhiều categories
    @Query("SELECT n FROM NewsArticle n WHERE n.sectionName = ?1 AND n.category IN ?2 AND n.isActive = true AND n.status = 'APPROVED' ORDER BY n.publishedAt DESC")
    List<NewsArticle> findBySectionNameAndCategoryInAndIsActiveTrueOrderByPublishedAtDesc(String sectionName, List<String> categories, Pageable pageable);
    
    // Check if slug exists
    boolean existsBySlug(String slug);
    
    // Check if slug exists excluding specific article ID
    @Query("SELECT CASE WHEN COUNT(n) > 0 THEN true ELSE false END FROM NewsArticle n WHERE n.slug = ?1 AND n.id != ?2")
    boolean existsBySlugAndIdNot(String slug, Long id);
    
    // Tìm bài viết theo status (không lọc theo section_name)
    @Query("SELECT n FROM NewsArticle n WHERE n.status = ?1 AND n.isActive = true ORDER BY n.publishedAt DESC")
    List<NewsArticle> findByStatusAndIsActiveTrueOrderByPublishedAtDesc(String status, Pageable pageable);
    
    // Tìm bài viết theo nhiều categories và status (không lọc theo section_name)
    @Query("SELECT n FROM NewsArticle n WHERE n.category IN ?1 AND n.status = ?2 AND n.isActive = true ORDER BY n.publishedAt DESC")
    List<NewsArticle> findByCategoryInAndStatusAndIsActiveTrueOrderByPublishedAtDesc(List<String> categories, String status, Pageable pageable);
}