package com.doctorappointment.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtils {
    
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Pattern EDGESDHASHES = Pattern.compile("(^-|-$)");
    
    /**
     * Convert Vietnamese text to slug (URL-friendly format)
     * Example: "Bài viết về sức khỏe" -> "bai-viet-ve-suc-khoe"
     */
    public static String toSlug(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        
        // Convert Vietnamese characters to non-accented equivalents
        String noAccents = removeVietnameseAccents(input);
        
        // Convert to lowercase
        String lowercase = noAccents.toLowerCase();
        
        // Replace whitespace with hyphens
        String noWhitespace = WHITESPACE.matcher(lowercase).replaceAll("-");
        
        // Remove all non-word characters (except hyphens)
        String normalized = NONLATIN.matcher(noWhitespace).replaceAll("");
        
        // Remove hyphens from start and end
        String slug = EDGESDHASHES.matcher(normalized).replaceAll("");
        
        // Replace multiple consecutive hyphens with single hyphen
        slug = slug.replaceAll("-+", "-");
        
        return slug;
    }
    
    /**
     * Remove Vietnamese accents and convert special characters
     */
    private static String removeVietnameseAccents(String str) {
        // Replace Vietnamese characters
        str = str.replaceAll("[àáạảãâầấậẩẫăằắặẳẵ]", "a");
        str = str.replaceAll("[èéẹẻẽêềếệểễ]", "e");
        str = str.replaceAll("[ìíịỉĩ]", "i");
        str = str.replaceAll("[òóọỏõôồốộổỗơờớợởỡ]", "o");
        str = str.replaceAll("[ùúụủũưừứựửữ]", "u");
        str = str.replaceAll("[ỳýỵỷỹ]", "y");
        str = str.replaceAll("đ", "d");
        
        str = str.replaceAll("[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]", "A");
        str = str.replaceAll("[ÈÉẸẺẼÊỀẾỆỂỄ]", "E");
        str = str.replaceAll("[ÌÍỊỈĨ]", "I");
        str = str.replaceAll("[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]", "O");
        str = str.replaceAll("[ÙÚỤỦŨƯỪỨỰỬỮ]", "U");
        str = str.replaceAll("[ỲÝỴỶỸ]", "Y");
        str = str.replaceAll("Đ", "D");
        
        // Normalize any remaining accents
        str = Normalizer.normalize(str, Normalizer.Form.NFD);
        str = str.replaceAll("\\p{M}", "");
        
        return str;
    }
    
    /**
     * Generate unique slug by appending number if slug already exists
     * Example: "bai-viet" -> "bai-viet-2" if "bai-viet" exists
     */
    public static String makeUniqueSlug(String baseSlug, int counter) {
        if (counter <= 1) {
            return baseSlug;
        }
        return baseSlug + "-" + counter;
    }
}
